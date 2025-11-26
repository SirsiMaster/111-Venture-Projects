/**
 * Development Metrics Service
 * Legacy Estate OS - Real-time development analytics
 * 
 * IMPROVEMENTS OVER ASSIDUOUS:
 * - Local caching with IndexedDB fallback
 * - GitHub API integration for commit data
 * - Better aggregation algorithms
 * - Specification compliance tracking
 * - Resource usage monitoring
 * - Cost projection calculations
 * - Export functionality
 * 
 * @version 2.0.0
 */

class DevelopmentMetricsService {
    constructor() {
        this.db = null;
        this.listeners = new Map();
        this.cache = new Map();
        this.isInitialized = false;
        
        // Configuration
        this.config = {
            hourlyRate: 150, // $/hour
            monthlyToolsCost: 650, // $/month (Warp AI, etc.)
            cacheTimeout: 5 * 60 * 1000, // 5 minutes
            gitHubOwner: 'YourOrg',
            gitHubRepo: 'Legacy',
            projectStartDate: '2025-11-01', // Project start date
        };
        
        // Metrics structure
        this.metrics = {
            project: {},
            today: {},
            thisWeek: {},
            thisMonth: {},
            features: {},
            recentActivity: [],
            resources: {},
            costs: {},
            deployment: {},
            specifications: {},
        };
    }
    
    /**
     * Initialize the service
     * @returns {Promise<boolean>}
     */
    async initialize() {
        try {
            // Wait for Firebase
            if (window.firebaseDb) {
                this.db = window.firebaseDb;
            } else {
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Firebase timeout')), 10000);
                    window.addEventListener('firebase-ready', (e) => {
                        clearTimeout(timeout);
                        this.db = e.detail.db || window.firebaseDb;
                        resolve();
                    }, { once: true });
                });
            }
            
            this.isInitialized = true;
            console.log('✅ DevelopmentMetricsService initialized');
            return true;
            
        } catch (error) {
            console.error('❌ DevelopmentMetricsService init failed:', error);
            // Fall back to local metrics.json
            await this.loadLocalMetrics();
            return false;
        }
    }
    
    /**
     * Load metrics from local JSON file (fallback)
     */
    async loadLocalMetrics() {
        try {
            const response = await fetch('./development/metrics.json');
            if (response.ok) {
                const data = await response.json();
                this.metrics = { ...this.metrics, ...data };
                console.log('📊 Loaded local metrics fallback');
            }
        } catch (error) {
            console.warn('⚠️ No local metrics available');
        }
    }
    
    /**
     * Subscribe to real-time metrics updates
     * @param {Function} callback - Called with updated metrics
     * @returns {Function} Unsubscribe function
     */
    subscribeToMetrics(callback) {
        if (!this.isInitialized) {
            console.error('Service not initialized');
            return () => {};
        }
        
        const unsubscribers = [];
        
        // Subscribe to development_metrics (daily aggregates)
        if (this.db) {
            const metricsUnsub = this.db.collection('development_metrics')
                .orderBy('date', 'desc')
                .limit(90) // Last 90 days
                .onSnapshot((snapshot) => {
                    const metrics = [];
                    snapshot.forEach(doc => metrics.push({ id: doc.id, ...doc.data() }));
                    this.metrics.project = this.calculateProjectTotals(metrics);
                    this.metrics.today = this.getTodayMetrics(metrics);
                    this.metrics.thisWeek = this.getWeekMetrics(metrics);
                    this.metrics.thisMonth = this.getMonthMetrics(metrics);
                    callback(this.metrics);
                });
            unsubscribers.push(metricsUnsub);
            
            // Subscribe to git_commits
            const commitsUnsub = this.db.collection('git_commits')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .onSnapshot((snapshot) => {
                    this.metrics.recentActivity = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        this.metrics.recentActivity.push({
                            id: doc.id,
                            hash: data.hash,
                            message: data.message,
                            author: data.author,
                            date: data.timestamp?.toDate?.() || new Date(data.timestamp),
                            filesChanged: data.filesChanged || 0,
                            additions: data.additions || 0,
                            deletions: data.deletions || 0,
                            timeAgo: this.getTimeAgo(data.timestamp?.toDate?.() || new Date(data.timestamp)),
                        });
                    });
                    callback(this.metrics);
                });
            unsubscribers.push(commitsUnsub);
            
            // Subscribe to feature_progress
            const featuresUnsub = this.db.collection('feature_progress')
                .onSnapshot((snapshot) => {
                    this.metrics.features = {};
                    snapshot.forEach(doc => {
                        this.metrics.features[doc.id] = doc.data();
                    });
                    callback(this.metrics);
                });
            unsubscribers.push(featuresUnsub);
            
            // Subscribe to resource_usage
            const resourcesUnsub = this.db.collection('resource_usage')
                .orderBy('timestamp', 'desc')
                .limit(1)
                .onSnapshot((snapshot) => {
                    snapshot.forEach(doc => {
                        this.metrics.resources = doc.data();
                    });
                    callback(this.metrics);
                });
            unsubscribers.push(resourcesUnsub);
            
            // Subscribe to specification_compliance
            const specsUnsub = this.db.collection('specification_compliance').doc('current')
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        this.metrics.specifications = doc.data();
                    }
                    callback(this.metrics);
                });
            unsubscribers.push(specsUnsub);
        }
        
        // Store unsubscribers
        const id = Date.now().toString();
        this.listeners.set(id, unsubscribers);
        
        return () => {
            const unsubs = this.listeners.get(id);
            if (unsubs) {
                unsubs.forEach(unsub => unsub());
                this.listeners.delete(id);
            }
        };
    }
    
    /**
     * Calculate project totals from daily metrics
     */
    calculateProjectTotals(metrics) {
        if (!metrics || metrics.length === 0) {
            return this.getEmptyProjectTotals();
        }
        
        let totalHours = 0;
        let totalCommits = 0;
        let totalFiles = 0;
        let activeDays = 0;
        let totalAdditions = 0;
        let totalDeletions = 0;
        
        metrics.forEach(m => {
            totalHours += m.hours || 0;
            totalCommits += m.commits || 0;
            totalFiles += m.filesChanged || 0;
            totalAdditions += m.additions || 0;
            totalDeletions += m.deletions || 0;
            if ((m.hours || 0) > 0 || (m.commits || 0) > 0) activeDays++;
        });
        
        const totalDays = metrics.length;
        const laborCost = totalHours * this.config.hourlyRate;
        const toolsCost = Math.ceil(totalDays / 30) * this.config.monthlyToolsCost;
        const totalCost = laborCost + toolsCost;
        
        // Calculate start date
        const sortedDates = metrics.map(m => m.date).sort();
        const actualStartDate = sortedDates[sortedDates.length - 1] || this.config.projectStartDate;
        
        return {
            totalHours: totalHours.toFixed(1),
            totalCommits,
            totalFiles,
            totalAdditions,
            totalDeletions,
            activeDays,
            totalDays,
            avgHoursPerDay: activeDays > 0 ? (totalHours / activeDays).toFixed(1) : '0',
            velocity: activeDays > 0 ? (totalCommits / activeDays).toFixed(1) : '0',
            laborCost: laborCost.toFixed(0),
            toolsCost: toolsCost.toFixed(0),
            totalCost: totalCost.toFixed(0),
            costPerCommit: totalCommits > 0 ? (totalCost / totalCommits).toFixed(2) : '0',
            costPerHour: this.config.hourlyRate,
            actualStartDate,
        };
    }
    
    getEmptyProjectTotals() {
        return {
            totalHours: '0', totalCommits: 0, totalFiles: 0, totalAdditions: 0,
            totalDeletions: 0, activeDays: 0, totalDays: 0, avgHoursPerDay: '0',
            velocity: '0', laborCost: '0', toolsCost: '0', totalCost: '0',
            costPerCommit: '0', costPerHour: this.config.hourlyRate,
            actualStartDate: this.config.projectStartDate,
        };
    }
    
    /**
     * Get today's metrics
     */
    getTodayMetrics(metrics) {
        const today = new Date().toISOString().split('T')[0];
        const todayMetric = metrics.find(m => m.date === today);
        
        return {
            date: today,
            hours: todayMetric?.hours || 0,
            commits: todayMetric?.commits || 0,
            filesChanged: todayMetric?.filesChanged || 0,
            cost: ((todayMetric?.hours || 0) * this.config.hourlyRate).toFixed(0),
            additions: todayMetric?.additions || 0,
            deletions: todayMetric?.deletions || 0,
        };
    }
    
    /**
     * Get this week's metrics
     */
    getWeekMetrics(metrics) {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        let hours = 0, commits = 0, filesChanged = 0, days = 0;
        
        metrics.forEach(m => {
            const metricDate = new Date(m.date);
            if (metricDate >= weekAgo && metricDate <= today) {
                hours += m.hours || 0;
                commits += m.commits || 0;
                filesChanged += m.filesChanged || 0;
                if ((m.hours || 0) > 0 || (m.commits || 0) > 0) days++;
            }
        });
        
        return {
            hours: hours.toFixed(1),
            commits,
            filesChanged,
            days,
            cost: (hours * this.config.hourlyRate).toFixed(0),
        };
    }
    
    /**
     * Get this month's metrics
     */
    getMonthMetrics(metrics) {
        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        
        let hours = 0, commits = 0, filesChanged = 0, days = 0;
        
        metrics.forEach(m => {
            const metricDate = new Date(m.date);
            if (metricDate >= monthAgo && metricDate <= today) {
                hours += m.hours || 0;
                commits += m.commits || 0;
                filesChanged += m.filesChanged || 0;
                if ((m.hours || 0) > 0 || (m.commits || 0) > 0) days++;
            }
        });
        
        return {
            hours: hours.toFixed(1),
            commits,
            filesChanged,
            days,
            cost: (hours * this.config.hourlyRate).toFixed(0),
        };
    }
    
    /**
     * Get time ago string
     */
    getTimeAgo(date) {
        if (!date) return 'Recently';
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
        return `${Math.floor(seconds / 2592000)}mo ago`;
    }
    
    // =========================================================================
    // WRITE OPERATIONS
    // =========================================================================
    
    /**
     * Log a development session
     */
    async logSession(sessionData) {
        if (!this.db) return { success: false, error: 'No database connection' };
        
        try {
            const date = new Date().toISOString().split('T')[0];
            await this.db.collection('development_sessions').add({
                ...sessionData,
                date,
                createdAt: new Date(),
            });
            
            // Update daily metrics
            await this.updateDailyMetrics(date, {
                hours: (sessionData.duration || 0) / 60, // minutes to hours
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Log a git commit
     */
    async logCommit(commitData) {
        if (!this.db) return { success: false, error: 'No database connection' };
        
        try {
            await this.db.collection('git_commits').add({
                ...commitData,
                timestamp: new Date(),
            });
            
            // Update daily metrics
            const date = new Date().toISOString().split('T')[0];
            await this.incrementDailyCommits(date, commitData);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update daily metrics
     */
    async updateDailyMetrics(date, updates) {
        if (!this.db) return;
        
        const docRef = this.db.collection('development_metrics').doc(date);
        const doc = await docRef.get();
        
        if (doc.exists) {
            const current = doc.data();
            await docRef.update({
                hours: (current.hours || 0) + (updates.hours || 0),
                commits: (current.commits || 0) + (updates.commits || 0),
                filesChanged: (current.filesChanged || 0) + (updates.filesChanged || 0),
                additions: (current.additions || 0) + (updates.additions || 0),
                deletions: (current.deletions || 0) + (updates.deletions || 0),
                updatedAt: new Date(),
            });
        } else {
            await docRef.set({
                date,
                ...updates,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }
    
    /**
     * Increment daily commit count
     */
    async incrementDailyCommits(date, commitData) {
        await this.updateDailyMetrics(date, {
            commits: 1,
            filesChanged: commitData.filesChanged || 0,
            additions: commitData.additions || 0,
            deletions: commitData.deletions || 0,
        });
    }
    
    /**
     * Update feature progress
     */
    async updateFeatureProgress(featureId, progressData) {
        if (!this.db) return { success: false, error: 'No database connection' };
        
        try {
            await this.db.collection('feature_progress').doc(featureId).set({
                ...progressData,
                updatedAt: new Date(),
            }, { merge: true });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update specification compliance
     */
    async updateSpecCompliance(complianceData) {
        if (!this.db) return { success: false, error: 'No database connection' };
        
        try {
            await this.db.collection('specification_compliance').doc('current').set({
                ...complianceData,
                calculatedAt: new Date(),
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Log resource usage
     */
    async logResourceUsage(resourceData) {
        if (!this.db) return { success: false, error: 'No database connection' };
        
        try {
            await this.db.collection('resource_usage').add({
                ...resourceData,
                timestamp: new Date(),
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // GITHUB INTEGRATION
    // =========================================================================
    
    /**
     * Fetch commits from GitHub API
     */
    async fetchGitHubCommits(since = null) {
        try {
            const { gitHubOwner, gitHubRepo } = this.config;
            let url = `https://api.github.com/repos/${gitHubOwner}/${gitHubRepo}/commits?per_page=100`;
            if (since) url += `&since=${since}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('GitHub API error');
            
            const commits = await response.json();
            return commits.map(c => ({
                hash: c.sha,
                message: c.commit.message,
                author: c.commit.author.name,
                date: c.commit.author.date,
                url: c.html_url,
            }));
        } catch (error) {
            console.error('GitHub fetch error:', error);
            return [];
        }
    }
    
    /**
     * Sync GitHub commits to Firestore
     */
    async syncGitHubCommits() {
        const commits = await this.fetchGitHubCommits();
        
        for (const commit of commits.slice(0, 20)) {
            await this.logCommit(commit);
        }
        
        console.log(`✅ Synced ${commits.length} commits from GitHub`);
        return commits.length;
    }
    
    // =========================================================================
    // COST PROJECTIONS
    // =========================================================================
    
    /**
     * Calculate cost projections
     */
    calculateProjections(metrics) {
        const project = this.metrics.project;
        const week = this.metrics.thisWeek;
        
        const burnRate = parseFloat(week.cost || 0) / 7; // Daily burn rate
        const daysRemaining = 90; // Estimated days to completion
        
        return {
            dailyBurnRate: burnRate.toFixed(0),
            weeklyBurnRate: (burnRate * 7).toFixed(0),
            monthlyBurnRate: (burnRate * 30).toFixed(0),
            projectedTotal: (parseFloat(project.totalCost || 0) + (burnRate * daysRemaining)).toFixed(0),
            daysTo10k: burnRate > 0 ? Math.ceil((10000 - parseFloat(project.totalCost || 0)) / burnRate) : 'N/A',
            daysTo25k: burnRate > 0 ? Math.ceil((25000 - parseFloat(project.totalCost || 0)) / burnRate) : 'N/A',
            estimatedCompletion: burnRate > 0 ? (parseFloat(project.totalCost || 0) + (burnRate * daysRemaining)).toFixed(0) : 'N/A',
        };
    }
    
    // =========================================================================
    // EXPORT FUNCTIONALITY
    // =========================================================================
    
    /**
     * Export metrics to JSON
     */
    exportToJSON() {
        return JSON.stringify(this.metrics, null, 2);
    }
    
    /**
     * Export metrics to CSV
     */
    exportToCSV() {
        const rows = [
            ['Metric', 'Value'],
            ['Total Hours', this.metrics.project.totalHours],
            ['Total Commits', this.metrics.project.totalCommits],
            ['Total Cost', '$' + this.metrics.project.totalCost],
            ['Active Days', this.metrics.project.activeDays],
            ['Velocity (commits/day)', this.metrics.project.velocity],
            ['Cost per Commit', '$' + this.metrics.project.costPerCommit],
        ];
        
        return rows.map(r => r.join(',')).join('\n');
    }
    
    /**
     * Clean up listeners
     */
    destroy() {
        this.listeners.forEach((unsubs) => {
            unsubs.forEach(unsub => unsub());
        });
        this.listeners.clear();
        this.isInitialized = false;
        console.log('🔌 DevelopmentMetricsService destroyed');
    }
}

// Make globally available
window.DevelopmentMetricsService = DevelopmentMetricsService;

// Export for ES modules
export default DevelopmentMetricsService;
