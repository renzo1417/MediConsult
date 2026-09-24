// Motion.dev-inspired Interactive and Smooth Scroll Animations for MediConsult

(function () {
    // 1. Scroll Progress Bar
    function initScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
                progressBar.style.width = progress + '%';
            }
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // 2. Intersection Observer for Scroll Reveals
    let revealObserver = null;

    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible), .reveal-fade:not(.is-visible), .reveal-scale:not(.is-visible)');
        if (!revealElements.length) return;

        if (!revealObserver) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -40px 0px',
                threshold: 0.08
            };

            revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
        }

        revealElements.forEach(el => {
            // If already in viewport on load, reveal immediately
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('is-visible');
            } else {
                revealObserver.observe(el);
            }
        });
    }

    // 3. Motion.dev Button Haptic/Spring Interaction Helper
    function initMotionButtons() {
        const buttons = document.querySelectorAll('.motion-btn');
        buttons.forEach(btn => {
            if (btn._hasMotionDevInit) return;
            btn._hasMotionDevInit = true;

            // Subtle magnetic / spring cursor tracking
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                // Subtle magnet pull: max 3px
                const pullX = (x / rect.width) * 4;
                const pullY = (y / rect.height) * 4;
                btn.style.transform = `translate(${pullX}px, ${pullY - 2}px) scale(1.025)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });

            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'translateY(1px) scale(0.96)';
            });

            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'translateY(-2px) scale(1.025)';
            });
        });
    }

    // 4. Interactive Card Spotlight Effect
    function initCardSpotlights() {
        const cards = document.querySelectorAll('.motion-card-spotlight');
        cards.forEach(card => {
            if (card._hasSpotlightInit) return;
            card._hasSpotlightInit = true;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--spotlight-x', `${x}px`);
                card.style.setProperty('--spotlight-y', `${y}px`);
            });
        });
    }

    // 5. Cross-Page & In-Page Anchor Navigation System
    let isScrolling = false;

    function getTargetOffset(el) {
        const navHeight = 84; // Navbar height + breathing margin
        const rect = el.getBoundingClientRect();
        return rect.top + window.pageYOffset - navHeight;
    }

    function smoothScrollToTarget(targetId) {
        if (!targetId) return false;
        const el = document.getElementById(targetId);
        if (el) {
            const offset = getTargetOffset(el);
            window.scrollTo({
                top: Math.max(0, offset),
                behavior: 'smooth'
            });
            return true;
        }
        return false;
    }

    function checkAndExecutePendingScroll() {
        if (isScrolling) return;
        const pending = sessionStorage.getItem('medconsult_scroll_target');
        const hashTarget = window.location.hash ? window.location.hash.replace('#', '') : null;
        const targetId = pending || hashTarget;

        if (!targetId) return;

        // Try immediate scroll
        const el = document.getElementById(targetId);
        if (el) {
            isScrolling = true;
            sessionStorage.removeItem('medconsult_scroll_target');
            setTimeout(() => {
                smoothScrollToTarget(targetId);
                setTimeout(() => { isScrolling = false; }, 600);
            }, 60);
            return;
        }

        // If not in DOM yet (e.g. Blazor WebSocket rendering delay), poll up to 2 seconds
        let attempts = 0;
        const poll = setInterval(() => {
            attempts++;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                clearInterval(poll);
                sessionStorage.removeItem('medconsult_scroll_target');
                isScrolling = true;
                setTimeout(() => {
                    smoothScrollToTarget(targetId);
                    setTimeout(() => { isScrolling = false; }, 600);
                }, 60);
            } else if (attempts >= 40) {
                clearInterval(poll);
                sessionStorage.removeItem('medconsult_scroll_target');
            }
        }, 50);
    }

    // Global anchor click listener for hash links & back to landing page
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;

        // Handle hash navigation (e.g. "/#about", "/#services", "/#pricing", "#about", etc.)
        if (href.startsWith('/#') || (href.startsWith('#') && href.length > 1)) {
            const hashIndex = href.indexOf('#');
            const targetId = href.substring(hashIndex + 1);
            const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

            if (currentPath === '/') {
                // Already on the landing page: smooth scroll directly
                const el = document.getElementById(targetId);
                if (el) {
                    e.preventDefault();
                    history.pushState(null, '', '/#' + targetId);
                    smoothScrollToTarget(targetId);
                }
            } else {
                // On another page (e.g. /how-it-works): save target and navigate to landing page
                e.preventDefault();
                sessionStorage.setItem('medconsult_scroll_target', targetId);
                window.location.href = '/#' + targetId;
            }
        } else if (href === '/' || href === '') {
            // Home / Logo / Back to landing page
            const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
            if (currentPath === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                history.pushState(null, '', '/');
            }
        }
    });

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            smoothScrollToTarget(hash);
        }
    });

    // 6. Initialize & Observe DOM mutations (for Blazor re-renders)
    function setupAll() {
        initScrollProgress();
        initScrollReveals();
        initMotionButtons();
        initCardSpotlights();
        checkAndExecutePendingScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAll);
    } else {
        setupAll();
    }

    // Check hash scroll immediately on initial script execution
    checkAndExecutePendingScroll();

    // Watch for Blazor DOM updates / route navigation
    const observer = new MutationObserver(() => {
        setupAll();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

