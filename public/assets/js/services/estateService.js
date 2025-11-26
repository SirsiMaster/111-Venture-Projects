/**
 * Estate Service
 * Legacy Estate OS - Estate management operations
 * 
 * Handles all estate-related data operations including:
 * - Estate CRUD operations
 * - Asset management
 * - Beneficiary management
 * - Phase/status tracking
 * - Document associations
 * 
 * @version 1.0.0
 */

class EstateService {
    constructor() {
        this.db = null;
        this.isInitialized = false;
    }
    
    /**
     * Initialize the service
     */
    async initialize() {
        try {
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
            console.log('✅ EstateService initialized');
            return true;
        } catch (error) {
            console.error('❌ EstateService init failed:', error);
            return false;
        }
    }
    
    // =========================================================================
    // ESTATE OPERATIONS
    // =========================================================================
    
    /**
     * Get all estates (optionally filtered)
     */
    async getEstates(filters = {}) {
        try {
            let query = this.db.collection('estates');
            
            if (filters.principalId) {
                query = query.where('principalId', '==', filters.principalId);
            }
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }
            if (filters.phase) {
                query = query.where('phase', '==', filters.phase);
            }
            
            query = query.orderBy('createdAt', 'desc');
            
            if (filters.limit) {
                query = query.limit(filters.limit);
            }
            
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Error getting estates:', error);
            return [];
        }
    }
    
    /**
     * Get a single estate by ID
     */
    async getEstate(estateId) {
        try {
            const doc = await this.db.collection('estates').doc(estateId).get();
            if (doc.exists) {
                return { success: true, data: { id: doc.id, ...doc.data() } };
            }
            return { success: false, error: 'Estate not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Create a new estate
     */
    async createEstate(estateData) {
        try {
            const estate = {
                ...estateData,
                status: estateData.status || 'active',
                phase: estateData.phase || 'planning',
                phases: {
                    planning: { status: 'active', startedAt: new Date() },
                    documentation: { status: 'pending' },
                    notification: { status: 'pending' },
                    distribution: { status: 'pending' },
                    closing: { status: 'pending' },
                },
                assets: [],
                beneficiaries: [],
                documents: [],
                tasks: [],
                timeline: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            
            const docRef = await this.db.collection('estates').add(estate);
            
            // Log event
            await this.logEstateEvent(docRef.id, 'created', 'Estate created');
            
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update an estate
     */
    async updateEstate(estateId, updates) {
        try {
            await this.db.collection('estates').doc(estateId).update({
                ...updates,
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'updated', 'Estate updated');
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Delete an estate (soft delete)
     */
    async deleteEstate(estateId) {
        try {
            await this.db.collection('estates').doc(estateId).update({
                status: 'deleted',
                deletedAt: new Date(),
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'deleted', 'Estate deleted');
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // PHASE MANAGEMENT
    // =========================================================================
    
    /**
     * Update estate phase
     */
    async updatePhase(estateId, phase, status) {
        try {
            const updates = {};
            updates[`phases.${phase}.status`] = status;
            
            if (status === 'active') {
                updates[`phases.${phase}.startedAt`] = new Date();
                updates.phase = phase;
            } else if (status === 'completed') {
                updates[`phases.${phase}.completedAt`] = new Date();
            }
            
            await this.db.collection('estates').doc(estateId).update({
                ...updates,
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'phase_changed', `Phase ${phase} changed to ${status}`);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // ASSET MANAGEMENT
    // =========================================================================
    
    /**
     * Add an asset to an estate
     */
    async addAsset(estateId, assetData) {
        try {
            const asset = {
                id: Date.now().toString(),
                ...assetData,
                createdAt: new Date(),
            };
            
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const assets = estate.data.assets || [];
            assets.push(asset);
            
            await this.db.collection('estates').doc(estateId).update({
                assets,
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'asset_added', `Asset added: ${assetData.name}`);
            
            return { success: true, assetId: asset.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update an asset
     */
    async updateAsset(estateId, assetId, updates) {
        try {
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const assets = estate.data.assets || [];
            const index = assets.findIndex(a => a.id === assetId);
            
            if (index === -1) return { success: false, error: 'Asset not found' };
            
            assets[index] = { ...assets[index], ...updates, updatedAt: new Date() };
            
            await this.db.collection('estates').doc(estateId).update({
                assets,
                updatedAt: new Date(),
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Remove an asset
     */
    async removeAsset(estateId, assetId) {
        try {
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const assets = (estate.data.assets || []).filter(a => a.id !== assetId);
            
            await this.db.collection('estates').doc(estateId).update({
                assets,
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'asset_removed', 'Asset removed');
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // BENEFICIARY MANAGEMENT
    // =========================================================================
    
    /**
     * Add a beneficiary
     */
    async addBeneficiary(estateId, beneficiaryData) {
        try {
            const beneficiary = {
                id: Date.now().toString(),
                ...beneficiaryData,
                status: 'pending',
                createdAt: new Date(),
            };
            
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const beneficiaries = estate.data.beneficiaries || [];
            beneficiaries.push(beneficiary);
            
            await this.db.collection('estates').doc(estateId).update({
                beneficiaries,
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'beneficiary_added', `Beneficiary added: ${beneficiaryData.name}`);
            
            return { success: true, beneficiaryId: beneficiary.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update a beneficiary
     */
    async updateBeneficiary(estateId, beneficiaryId, updates) {
        try {
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const beneficiaries = estate.data.beneficiaries || [];
            const index = beneficiaries.findIndex(b => b.id === beneficiaryId);
            
            if (index === -1) return { success: false, error: 'Beneficiary not found' };
            
            beneficiaries[index] = { ...beneficiaries[index], ...updates, updatedAt: new Date() };
            
            await this.db.collection('estates').doc(estateId).update({
                beneficiaries,
                updatedAt: new Date(),
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // TASK MANAGEMENT
    // =========================================================================
    
    /**
     * Add a task to an estate
     */
    async addTask(estateId, taskData) {
        try {
            const task = {
                id: Date.now().toString(),
                ...taskData,
                status: 'pending',
                createdAt: new Date(),
            };
            
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const tasks = estate.data.tasks || [];
            tasks.push(task);
            
            await this.db.collection('estates').doc(estateId).update({
                tasks,
                updatedAt: new Date(),
            });
            
            return { success: true, taskId: task.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update task status
     */
    async updateTaskStatus(estateId, taskId, status) {
        try {
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const tasks = estate.data.tasks || [];
            const index = tasks.findIndex(t => t.id === taskId);
            
            if (index === -1) return { success: false, error: 'Task not found' };
            
            tasks[index].status = status;
            if (status === 'completed') {
                tasks[index].completedAt = new Date();
            }
            
            await this.db.collection('estates').doc(estateId).update({
                tasks,
                updatedAt: new Date(),
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // DOCUMENT ASSOCIATIONS
    // =========================================================================
    
    /**
     * Link a document to an estate
     */
    async linkDocument(estateId, documentData) {
        try {
            const document = {
                id: documentData.documentId || Date.now().toString(),
                ...documentData,
                linkedAt: new Date(),
            };
            
            const estate = await this.getEstate(estateId);
            if (!estate.success) return estate;
            
            const documents = estate.data.documents || [];
            documents.push(document);
            
            await this.db.collection('estates').doc(estateId).update({
                documents,
                updatedAt: new Date(),
            });
            
            await this.logEstateEvent(estateId, 'document_linked', `Document linked: ${documentData.name}`);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // TIMELINE & EVENTS
    // =========================================================================
    
    /**
     * Log an estate event
     */
    async logEstateEvent(estateId, eventType, description, metadata = {}) {
        try {
            const event = {
                type: eventType,
                description,
                metadata,
                timestamp: new Date(),
            };
            
            const estate = await this.getEstate(estateId);
            if (!estate.success) return;
            
            const timeline = estate.data.timeline || [];
            timeline.push(event);
            
            await this.db.collection('estates').doc(estateId).update({
                timeline,
            });
        } catch (error) {
            console.error('Error logging estate event:', error);
        }
    }
    
    /**
     * Get estate timeline
     */
    async getTimeline(estateId) {
        const estate = await this.getEstate(estateId);
        if (!estate.success) return [];
        return estate.data.timeline || [];
    }
    
    // =========================================================================
    // STATISTICS
    // =========================================================================
    
    /**
     * Get estate statistics
     */
    async getStatistics() {
        try {
            const estates = await this.getEstates();
            
            const stats = {
                total: estates.length,
                byStatus: {},
                byPhase: {},
                totalAssets: 0,
                totalBeneficiaries: 0,
            };
            
            estates.forEach(estate => {
                // Count by status
                const status = estate.status || 'unknown';
                stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
                
                // Count by phase
                const phase = estate.phase || 'unknown';
                stats.byPhase[phase] = (stats.byPhase[phase] || 0) + 1;
                
                // Count assets and beneficiaries
                stats.totalAssets += (estate.assets || []).length;
                stats.totalBeneficiaries += (estate.beneficiaries || []).length;
            });
            
            return { success: true, data: stats };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // =========================================================================
    // REAL-TIME SUBSCRIPTIONS
    // =========================================================================
    
    /**
     * Subscribe to estate updates
     */
    subscribeToEstate(estateId, callback) {
        return this.db.collection('estates').doc(estateId).onSnapshot(
            (doc) => {
                if (doc.exists) {
                    callback({ id: doc.id, ...doc.data() });
                }
            },
            (error) => console.error('Estate subscription error:', error)
        );
    }
    
    /**
     * Subscribe to all estates
     */
    subscribeToEstates(callback, filters = {}) {
        let query = this.db.collection('estates');
        
        if (filters.status) {
            query = query.where('status', '==', filters.status);
        }
        
        query = query.orderBy('createdAt', 'desc');
        
        return query.onSnapshot(
            (snapshot) => {
                const estates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(estates);
            },
            (error) => console.error('Estates subscription error:', error)
        );
    }
}

// Make globally available
window.EstateService = EstateService;

export default EstateService;
