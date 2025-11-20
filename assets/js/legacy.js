/**
 * Legacy - Core Application Logic
 * Handles State Management, View Routing, and the "Shepherd" Step Engine
 */

class LegacyApp {
    constructor() {
        this.state = {
            profile: null,
            phases: [],
            domains: [],
            tasks: [],
            currentPhaseId: 'p1'
        };

        this.init();
    }

    init() {
        this.loadData();
        this.setupNavigation();
        this.renderGuidedPath();
        this.renderDomains();
        this.renderTaskList();
        this.registerServiceWorker();
    }

    // --- Data & State ---

    loadData() {
        // In a real app, this would fetch from an API
        // For PoC, we load from MOCK_DATA and merge with LocalStorage
        const storedState = localStorage.getItem('legacy_state');
        
        if (storedState) {
            this.state = JSON.parse(storedState);
        } else {
            // Seed with mock data
            this.state.profile = MOCK_DATA.profile;
            this.state.phases = MOCK_DATA.phases;
            this.state.domains = MOCK_DATA.domains;
            this.state.tasks = MOCK_DATA.tasks;
            
            // Persist initial state
            this.saveState();
        }
    }

    saveState() {
        localStorage.setItem('legacy_state', JSON.stringify(this.state));
    }

    // --- Navigation ---

    setupNavigation() {
        const links = document.querySelectorAll('[data-view]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Handle desktop vs mobile targets
                const viewName = e.currentTarget.getAttribute('data-view');
                this.switchView(viewName);
            });
        });
    }

    switchView(viewId) {
        // Update Views
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update Nav State (Desktop & Mobile)
        document.querySelectorAll('[data-view]').forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Header Title
        const titles = {
            'guided': 'Guided Path',
            'domains': 'Topics',
            'tasks': 'All Tasks',
            'timeline': 'Timeline',
            'contacts': 'Contacts',
            'documents': 'Documents',
            'settings': 'Settings'
        };
        document.getElementById('header-title').textContent = titles[viewId] || 'Legacy';
    }

    // --- Guided Path Engine (The Shepherd) ---

    getPhaseTasks(phaseId) {
        return this.state.tasks.filter(t => t.phaseId === phaseId);
    }

    getNextIncompleteTask(phaseId) {
        const tasks = this.getPhaseTasks(phaseId);
        return tasks.find(t => t.status !== 'completed') || null;
    }

    getPhaseProgress(phaseId) {
        const tasks = this.getPhaseTasks(phaseId);
        const completed = tasks.filter(t => t.status === 'completed').length;
        return tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
    }

    completeTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'completed';
            this.saveState();
            this.renderGuidedPath();
            this.renderTaskList(); // Update master list too
            
            // Visual feedback: Confetti
            this.triggerConfetti();
        }
    }

    triggerConfetti() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `confetti-fall ${Math.random() * 2 + 3}s linear`;
            document.body.appendChild(confetti);
            
            // Cleanup
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    simulateAutomation(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task || !task.automation) return;

        const btn = document.getElementById(`btn-auto-${taskId}`);
        const originalText = btn.innerHTML;
        
        // 1. Show Processing State
        btn.innerHTML = `<span class="sm-btn-loading"></span> Processing...`;
        btn.classList.add('sm-btn-disabled'); // Visual disable
        
        // 2. Simulate API Delay
        setTimeout(() => {
            // 3. Success State
            btn.innerHTML = `✓ ${task.automation.label.split(' ')[0]} Submitted!`;
            btn.classList.remove('sm-btn-primary', 'sm-btn-disabled'); // Remove primary
            btn.classList.add('sm-btn-success'); // Add success
            
            // 4. Mark as Done after delay
            setTimeout(() => {
                this.completeTask(taskId);
            }, 1500);
            
        }, 2000);
    }

    // --- Rendering ---

    renderGuidedPath() {
        const container = document.getElementById('view-guided');
        const currentPhase = this.state.phases.find(p => p.id === this.state.currentPhaseId);
        
        if (!currentPhase) return;

        const activeTask = this.getNextIncompleteTask(currentPhase.id);
        const tasks = this.getPhaseTasks(currentPhase.id);
        const currentStepNum = tasks.indexOf(activeTask) + 1;
        const totalSteps = tasks.length;
        const progressPercent = this.getPhaseProgress(currentPhase.id);
        
        // Phase-specific Hero Gradients
        const heroGradients = {
            'p1': 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)', // Sunset
            'p2': 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Morning
            'p3': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', // Ethereal
            'p4': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // Gold
            'p5': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'  // Deep
        };
        const heroBg = heroGradients[currentPhase.id] || heroGradients['p1'];

        // SVG Progress Ring Math
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

        let content = `
            <div class="phase-hero" style="background: ${heroBg};">
                <div class="phase-hero-overlay"></div>
            </div>
            <div class="phase-card has-hero" style="text-align:center;">
                <div class="progress-ring-container">
                    <svg class="progress-ring" width="120" height="120">
                        <circle
                            class="progress-ring__circle-bg"
                            stroke="rgba(0,0,0,0.1)"
                            stroke-width="8"
                            fill="transparent"
                            r="${radius}"
                            cx="60"
                            cy="60"
                        />
                        <circle
                            class="progress-ring__circle"
                            stroke="var(--accent-blue)"
                            stroke-width="8"
                            stroke-linecap="round"
                            fill="transparent"
                            r="${radius}"
                            cx="60"
                            cy="60"
                            style="stroke-dasharray: ${circumference} ${circumference}; stroke-dashoffset: ${strokeDashoffset};"
                        />
                    </svg>
                    <div class="progress-ring__text">
                        <span class="progress-ring__percent">${progressPercent}%</span>
                        <span class="progress-ring__label">Complete</span>
                    </div>
                </div>

                <span class="phase-badge">Current Phase</span>
                <h1 class="phase-title">${currentPhase.title}</h1>
                <p class="phase-desc">${currentPhase.description}</p>
            </div>
        `;

        if (activeTask) {
            // Determine Automation Button
            let automationHtml = '';
            if (activeTask.automation) {
                automationHtml = `
                    <button id="btn-auto-${activeTask.id}" 
                            class="sm-btn sm-btn-primary sm-mb-md" 
                            style="width:100%; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; font-weight:700; border:none; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);"
                            onclick="app.simulateAutomation('${activeTask.id}')">
                        ✨ Legacy Concierge: ${activeTask.automation.label}
                    </button>
                    <div style="text-align:center; font-size:12px; color:var(--sm-gray-500); margin-bottom:16px;">
                        or do it yourself below
                    </div>
                `;
            }

            content += `
                <div class="step-card">
                    <div class="step-header">
                        <span class="step-counter">Step ${currentStepNum} of ${totalSteps}</span>
                        <div class="sm-badge sm-badge-${activeTask.priority === 'Critical' ? 'danger' : 'warning'}">${activeTask.priority} Priority</div>
                    </div>
                    
                    <div class="step-content">
                        <h2 class="step-title">${activeTask.title}</h2>
                        
                        <div class="step-section">
                            <p class="step-text">${activeTask.description}</p>
                        </div>

                        <!-- Automation Option -->
                        ${automationHtml}

                        <div class="step-section">
                            <div class="step-section-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                Why This Matters
                            </div>
                            <p class="step-text" style="color:var(--sm-gray-600); font-size:15px;">${activeTask.whyItMatters}</p>
                        </div>

                        <div class="step-section">
                            <div class="step-section-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                                How To Do It
                            </div>
                            <ul style="margin:0; padding-left:20px; line-height:1.6; color:var(--legacy-text-primary);">
                                ${activeTask.howTo ? activeTask.howTo.map(step => `<li>${step}</li>`).join('') : `<li>${activeTask.whatYouNeed}</li>`}
                            </ul>
                        </div>
                    </div>

                    <div class="step-actions">
                        <button class="sm-btn sm-btn-secondary" onclick="alert('Skipped for now')">Do Later</button>
                        <button class="sm-btn sm-btn-outline" onclick="app.completeTask('${activeTask.id}')">Mark as Done</button>
                    </div>
                </div>
            `;
        } else {
            content += `
                <div class="step-card" style="text-align:center; padding:40px;">
                    <h2 class="step-title">Phase Complete</h2>
                    <p class="step-text">You have completed all tasks in the ${currentPhase.title} phase.</p>
                    <button class="sm-btn sm-btn-success sm-mt-lg" onclick="alert('Moving to next phase...')">Start Next Phase</button>
                </div>
            `;
        }

        container.innerHTML = content;
    }

    renderDomains() {
        const container = document.getElementById('domains-grid');
        container.innerHTML = this.state.domains.map(d => `
            <div class="domain-card">
                <span class="domain-icon">${d.icon}</span>
                <div class="domain-name">${d.name}</div>
            </div>
        `).join('');
    }

    renderTaskList() {
        const container = document.getElementById('tasks-list');
        // Group tasks by Phase for better reading
        let content = '';
        
        this.state.phases.forEach(phase => {
            const phaseTasks = this.getPhaseTasks(phase.id);
            if (phaseTasks.length > 0) {
                content += `<h3 style="margin: 24px 0 12px 0; padding-left: 8px; border-left: 4px solid ${phase.color || '#ccc'};">${phase.title}</h3>`;
                
                phaseTasks.forEach(task => {
                    const isDone = task.status === 'completed';
                    content += `
                        <div class="sm-card sm-mb-sm" style="opacity: ${isDone ? 0.6 : 1}; display:flex; align-items:center; padding:16px;">
                            <div style="flex:1;">
                                <div style="font-weight:600; text-decoration: ${isDone ? 'line-through' : 'none'}">${task.title}</div>
                                <div style="font-size:12px; color:var(--sm-gray-500);">${task.estimatedTime} • ${task.priority}</div>
                            </div>
                            ${isDone ? '<span class="sm-badge sm-badge-success">Done</span>' : ''}
                        </div>
                    `;
                });
            }
        });

        container.innerHTML = content;
    }

    // --- PWA Support ---
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => console.log('ServiceWorker registered'))
                .catch(err => console.log('ServiceWorker failed', err));
        }
    }
}

// Initialize App
const app = new LegacyApp();