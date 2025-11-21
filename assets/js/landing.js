/**
 * Legacy - Landing Page Logic
 * Handles mobile navigation, smooth scrolling, and other landing page interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
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
            if (targetId === '#') return;

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
