/**
 * Legacy - Landing Page Logic
 * Handles mobile navigation, smooth scrolling, scroll animations, and metrics counters.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initMetricCounters();
});

function initMobileNav() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-menu .nav-link');

    if (!btn || !menu) return;

    // Toggle menu
    btn.addEventListener('click', () => {
        const isOpen = menu.classList.contains('active');
        if (isOpen) {
            menu.classList.remove('active');
            btn.innerHTML = '<i class="ph-bold ph-list"></i>';
        } else {
            menu.classList.add('active');
            btn.innerHTML = '<i class="ph-bold ph-x"></i>';
        }
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.innerHTML = '<i class="ph-bold ph-list"></i>';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

function initMetricCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(el) {
    const targetAttr = el.getAttribute('data-target');
    if (!targetAttr) return; // Skip if no target

    const target = parseInt(targetAttr);
    if (isNaN(target)) return; // Safety check

    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target.toLocaleString() + "+"; // Add plus sign back
            clearInterval(timer);
        } else {
            el.innerText = Math.ceil(current).toLocaleString();
        }
    }, stepTime);
}
