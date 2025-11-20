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
        this.showWelcomeIfNeeded();
    }

    showWelcomeIfNeeded() {
        // Always show for demo; in production, check localStorage
        const hasSeenWelcome = localStorage.getItem('legacy_has_seen_welcome');
        if (!hasSeenWelcome) {
            // Welcome overlay is visible by default in HTML
        } else {
            // Hide immediately if already seen
            document.getElementById('view-welcome').classList.add('hidden');
        }
    }

    dismissWelcome() {
        const welcomeEl = document.getElementById('view-welcome');
        welcomeEl.classList.add('hidden');
        localStorage.setItem('legacy_has_seen_welcome', 'true');
        
        // Optional: Analytics tracking
        // trackEvent('welcome_dismissed');
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
            'p1': 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', // Deep Space
            'p2': 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', // Deep Teal
            'p3': 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', // Metallic Blue
            'p4': 'linear-gradient(135deg, #302b63 0%, #24243e 100%)', // Deep Purple
            'p5': 'linear-gradient(135deg, #232526 0%, #414345 100%)'  // Obsidian
        };
        const heroBg = heroGradients[currentPhase.id] || heroGradients['p1'];

        // SVG Progress Ring Math
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

        let content = `
            <div class="guided-hero">
                <div class="guided-progress-ring">
                    <svg class="progress-ring" width="180" height="180" viewBox="0 0 120 120">
                        <circle stroke="rgba(255,255,255,0.1)" stroke-width="8" fill="transparent" r="${radius}" cx="60" cy="60" />
                        <circle stroke="var(--tint-blue)" stroke-width="8" stroke-linecap="round" fill="transparent" r="${radius}" cx="60" cy="60" 
                                style="stroke-dasharray: ${circumference} ${circumference}; stroke-dashoffset: ${strokeDashoffset}; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.6s ease; filter: drop-shadow(0 0 10px var(--tint-blue));" />
                    </svg>
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
                        <span style="font-size: 40px; font-weight: 800; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">${progressPercent}%</span>
                        <span style="font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em;">${currentPhase.title}</span>
                    </div>
                </div>
            </div>
        `;

        if (activeTask) {
            // Automation Button Logic
            let automationHtml = '';
            if (activeTask.automation) {
                automationHtml = `
                    <div class="ios-card" style="background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%); border: 1px solid rgba(255,215,0,0.2);">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                            <i class="ph-fill ph-sparkle" style="color: var(--status-warning); font-size: 24px;"></i>
                            <span style="font-size:17px; font-weight:600; color:white;">Concierge Service Available</span>
                        </div>
                        <p class="ios-card-body" style="margin-bottom:16px;">We can handle <strong>${activeTask.automation.label}</strong> for you instantly.</p>
                        <button id="btn-auto-${activeTask.id}" class="ios-btn" style="background: var(--status-warning); color: black;" onclick="app.simulateAutomation('${activeTask.id}')">
                            Do it for me
                        </button>
                    </div>
                `;
            }

            content += `
                ${automationHtml}

                <div class="ios-large-title" style="padding-bottom:0;">
                    <span style="font-size: 13px; font-weight: 600; color: var(--tint-blue); text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 0 0 10px rgba(10, 132, 255, 0.5);">Step ${currentStepNum} of ${totalSteps}</span>
                    <h1 class="text-gradient" style="font-size: 32px; margin-top: 8px;">${activeTask.title}</h1>
                </div>

                <div class="ios-card">
                    <p class="ios-card-body" style="color: var(--text-primary); margin:0;">${activeTask.description}</p>
                </div>

                <div style="padding: 0 16px 8px 16px; font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">Why This Matters</div>
                <div class="ios-list-group">
                    <div class="ios-list-item" style="cursor: default;">
                        <div class="ios-content">
                            <div class="ios-body" style="font-size: 15px; line-height: 1.5; color: var(--text-primary);">${activeTask.whyItMatters}</div>
                        </div>
                    </div>
                </div>

                <div style="padding: 0 16px 8px 16px; font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">Action Items</div>
                <div class="ios-list-group">
                    ${(activeTask.howTo || [activeTask.whatYouNeed]).map((step, i) => `
                        <div class="ios-list-item">
                            <div style="width: 24px; height: 24px; background: #333; border-radius: 50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; margin-right:12px;">${i+1}</div>
                            <div class="ios-content" style="font-size: 15px;">${step}</div>
                        </div>
                    `).join('')}
                </div>

                <div style="padding: 16px;">
                    <button class="molten-btn" onclick="app.completeTask('${activeTask.id}')">Mark Step as Complete</button>
                    <button class="molten-btn molten-btn-secondary" onclick="alert('Skipped')">Skip for now</button>
                </div>
            `;
        } else {
            content += `
                <div class="ios-card" style="text-align:center; padding: 40px;">
                    <i class="ph-fill ph-check-circle" style="font-size: 64px; color: var(--status-success); margin-bottom: 24px; filter: drop-shadow(0 4px 20px var(--status-success));"></i>
                    <h2 class="text-gradient" style="font-size: 32px; margin-bottom: 12px;">Phase Complete</h2>
                    <p class="ios-card-body">You have completed all tasks in <strong>${currentPhase.title}</strong>.</p>
                    <button class="molten-btn" onclick="alert('Next Phase')">Continue to Next Phase</button>
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
        let content = '';
        
        this.state.phases.forEach(phase => {
            const phaseTasks = this.getPhaseTasks(phase.id);
            if (phaseTasks.length > 0) {
                content += `<div style="padding: 24px 16px 8px 16px; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: -0.01em;">${phase.title}</div>`;
                content += `<div class="ios-list-group">`;
                
                phaseTasks.forEach(task => {
                    const isDone = task.status === 'completed';
                    content += `
                        <div class="ios-list-item" onclick="app.toggleTask('${task.id}')">
                            <div class="ios-content">
                                <div class="ios-title" style="${isDone ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${task.title}</div>
                                <div class="ios-subtitle">${task.estimatedTime || '15 mins'}</div>
                            </div>
                            <div class="ios-checkbox ${isDone ? 'checked' : ''}"></div>
                        </div>
                    `;
                });
                
                content += `</div>`; // End list-group
            }
        });

        container.innerHTML = content;
    }

    toggleTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            if (task.status === 'completed') {
                task.status = 'pending';
            } else {
                task.status = 'completed';
                this.triggerConfetti();
            }
            this.saveState();
            this.renderTaskList();
            this.renderGuidedPath();
        }
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