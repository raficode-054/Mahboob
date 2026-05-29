/**
 * Bukhari Institutions Architecture Engine
 * Script Logic Matrix
 */

document.addEventListener("DOMContentLoaded", () => {
    initSmoothScrolling();
    initScrollCounters();
    initActiveNavLinks();
    initMobileMenuToggle();
    initBackToTopButton();
});

/**
 * 1. Global Intercept for Eased Scroll Snap Routing
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Offset calculation relative to sticky navigation header bar
                const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Quietly close mobile menu viewports if active upon link selection
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('mobile-active')) {
                    navLinks.classList.remove('mobile-active');
                }
            }
        });
    });
}

/**
 * 2. High-Performance Intersection Observer for Animated Counter Metrics
 */
function initScrollCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const runCountAnimation = (counter) => {
        const targetValue = parseInt(counter.getAttribute('data-target'), 10) || 0;
        let startValue = 0;
        
        // Dynamic speed scale: faster increments for larger target magnitudes
        const animationDuration = 2000; // 2 seconds execution block
        const totalSteps = 60; 
        const increment = Math.ceil(targetValue / totalSteps);
        const stepDelay = animationDuration / totalSteps;

        const counterInterval = setInterval(() => {
            startValue += increment;
            if (startValue >= targetValue) {
                counter.innerText = targetValue.toLocaleString() + "+";
                clearInterval(counterInterval);
            } else {
                counter.innerText = startValue.toLocaleString();
            }
        }, stepDelay);
    };

    const counterSection = document.querySelector('.stats-section');
    if (!counterSection) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => runCountAnimation(counter));
                observer.unobserve(entry.target); // Kill process trigger to guarantee single runtime cycle
            }
        });
    }, { threshold: 0.15 });

    counterObserver.observe(counterSection);
}

/**
 * 3. Reactive Scroll Position Tracking for Active Route States
 */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollThreshold = window.pageYOffset + (window.innerHeight / 3);

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollThreshold >= sectionTop && scrollThreshold < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
                // Optional CSS accent formatting rule mapping: 
                // .nav-links a.active { color: var(--secondary-color); border-bottom: 2px solid; }
            }
        });
    });
}

/**
 * 4. Fallback Programmatic Hook for Mobile Navigation Toggles
 */
function initMobileMenuToggle() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    if (!navContainer || !navLinks) return;

    // Injecting Hamburger Icon Matrix programmatically if not rendered in HTML tree markup
    let menuBtn = document.querySelector('.mobile-menu-btn');
    if (!menuBtn) {
        menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        menuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        `;
        
        // Dynamically append into structural layout container
        navContainer.appendChild(menuBtn);

        // Injecting basic runtime responsive overrides cleanly via stylesheet insertion
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @media (max-width: 480px) {
                .mobile-menu-btn { display: block !important; }
                .nav-links.mobile-active { 
                    display: flex !important; 
                    flex-direction: column;
                    position: absolute;
                    top: 100%; left: 0; width: 100%;
                    background: var(--primary-color);
                    padding: 20px; box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });
}

/**
 * 5. Floating Back-To-Top Interactive Interface
 */
function initBackToTopButton() {
    let topBtn = document.getElementById('backToTop');
    if (!topBtn) {
        topBtn = document.createElement('button');
        topBtn.id = 'backToTop';
        topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        topBtn.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            width: 45px; height: 45px;
            background-color: var(--secondary-color, #c9b024);
            color: white; border: none; border-radius: 50%;
            cursor: pointer; opacity: 0; visibility: hidden;
            transition: all 0.4s ease; z-index: 999;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(topBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            topBtn.style.opacity = '1';
            topBtn.style.visibility = 'visible';
        } else {
            topBtn.style.opacity = '0';
            topBtn.style.visibility = 'hidden';
        }
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
