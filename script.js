/* ============================================================================
   TAM LANDING PAGE - EXPERT-LEVEL JAVASCRIPT
   Handles: Parallax, Scroll Animations, Lazy Loading, Smooth Navigation
   ============================================================================ */

(function() {
    'use strict';

    // ============= CONFIGURATION =============
    const CONFIG = {
        scrollThrottle: 16,        // 60 FPS
        debounceDelay: 150,        // Input debounce
        lazyLoadMargin: '100px',   // Load images 100px before viewport
        parallaxSpeed: 0.5,        // Parallax effect speed
        animationDuration: 800     // Intersection animation duration
    };

    // ============= UTILITY FUNCTIONS =============
    
    /**
     * Throttle function - limits execution rate
     * @param {Function} func - Function to throttle
     * @param {Number} limit - Time limit in ms
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function - delays execution until after wait time
     * @param {Function} func - Function to debounce
     * @param {Number} wait - Wait time in ms
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Smooth scroll to element
     * @param {String|Element} target - Target element or selector
     * @param {Number} duration - Animation duration
     */
    function smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
        
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // 80px offset for header
        let startTime = null;

        // Easing function
        function easeInOutCubic(t) {
            return t < 0.5 
                ? 4 * t * t * t 
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // ============= HEADER SCROLL BEHAVIOR =============
    
    class HeaderController {
        constructor() {
            this.header = document.querySelector('.main-header');
            this.lastScroll = 0;
            this.isScrolling = false;
            
            if (!this.header) return;
            
            this.init();
        }

        init() {
            // Throttled scroll handler
            window.addEventListener('scroll', throttle(() => {
                this.handleScroll();
            }, CONFIG.scrollThrottle), { passive: true });
        }

        handleScroll() {
            const currentScroll = window.pageYOffset;
            
            requestAnimationFrame(() => {
                // Add shadow and background blur on scroll
                if (currentScroll > 50) {
                    this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                    this.header.style.backgroundColor = 'rgba(5, 5, 5, 0.98)';
                } else {
                    this.header.style.boxShadow = '';
                    this.header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
                }

                // Hide header on scroll down, show on scroll up (optional)
                // Uncomment below if you want auto-hide header:
                /*
                if (currentScroll > this.lastScroll && currentScroll > 100) {
                    this.header.style.transform = 'translateY(-100%)';
                } else {
                    this.header.style.transform = 'translateY(0)';
                }
                */

                this.lastScroll = currentScroll;
            });
        }
    }

    // ============= PARALLAX EFFECT =============
    
    class ParallaxController {
        constructor() {
            this.elements = document.querySelectorAll('[data-parallax]');
            this.ticking = false;
            
            if (this.elements.length === 0) return;
            
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                this.requestTick();
            }, { passive: true });
        }

        requestTick() {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                });
                this.ticking = true;
            }
        }

        update() {
            const scrollY = window.pageYOffset;
            
            this.elements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || CONFIG.parallaxSpeed;
                const rect = element.getBoundingClientRect();
                
                // Only apply parallax to visible elements
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = scrollY * speed;
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
            
            this.ticking = false;
        }
    }

    // ============= LAZY LOADING IMAGES =============
    
    class LazyLoader {
        constructor() {
            this.images = document.querySelectorAll('img[data-src]');
            
            if (this.images.length === 0) return;
            
            this.init();
        }

        init() {
            // Use IntersectionObserver for efficient lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: CONFIG.lazyLoadMargin
                });

                this.images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                this.images.forEach(img => this.loadImage(img));
            }
        }

        loadImage(img) {
            const src = img.dataset.src;
            if (!src) return;

            // Create a new image to preload
            const tempImage = new Image();
            
            tempImage.onload = () => {
                // Fade in effect
                img.style.opacity = '0';
                img.src = src;
                img.removeAttribute('data-src');
                
                requestAnimationFrame(() => {
                    img.style.transition = 'opacity 0.3s ease-in';
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                });
            };

            tempImage.onerror = () => {
                console.error('Failed to load image:', src);
                img.alt = 'Image failed to load';
            };

            tempImage.src = src;
        }
    }

    // ============= SCROLL REVEAL ANIMATIONS =============
    
    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll('.animate-on-scroll, .feat-card, .sub-card');
            
            if (this.elements.length === 0) return;
            
            this.init();
        }

        init() {
            // Add initial hidden state
            this.elements.forEach(el => {
                if (!el.classList.contains('revealed')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(50px)';
                }
            });

            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.reveal(entry.target);
                    }
                });
            }, observerOptions);

            this.elements.forEach(el => observer.observe(el));
        }

        reveal(element) {
            requestAnimationFrame(() => {
                element.style.transition = `opacity ${CONFIG.animationDuration}ms ease-out, transform ${CONFIG.animationDuration}ms cubic-bezier(0.165, 0.84, 0.44, 1)`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('revealed');
            });
        }
    }

    // ============= SMOOTH ANCHOR SCROLLING =============
    
    class SmoothNavigation {
        constructor() {
            this.anchors = document.querySelectorAll('a[href^="#"]');
            
            if (this.anchors.length === 0) return;
            
            this.init();
        }

        init() {
            this.anchors.forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    
                    // Ignore empty anchors
                    if (href === '#' || href === '#!') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        smoothScrollTo(target);
                        
                        // Update URL without triggering scroll
                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                    }
                });
            });
        }
    }

    // ============= FLOATING CARDS ANIMATION =============
    
    class FloatingCards {
        constructor() {
            this.cards = document.querySelectorAll('.stat-card-preview');
            
            if (this.cards.length === 0) return;
            
            this.init();
        }

        init() {
            // Add mouse parallax effect to floating cards
            const heroVisual = document.querySelector('.hero-visual');
            if (!heroVisual) return;

            heroVisual.addEventListener('mousemove', throttle((e) => {
                const rect = heroVisual.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / centerX;
                const moveY = (y - centerY) / centerY;

                this.cards.forEach((card, index) => {
                    const depth = (index + 1) * 5; // Different depth for each card
                    
                    requestAnimationFrame(() => {
                        card.style.transform = `
                            translate(${moveX * depth}px, ${moveY * depth}px) 
                            translateZ(0)
                        `;
                    });
                });
            }, 16), { passive: true });

            // Reset on mouse leave
            heroVisual.addEventListener('mouseleave', () => {
                this.cards.forEach(card => {
                    requestAnimationFrame(() => {
                        card.style.transform = 'translate(0, 0) translateZ(0)';
                    });
                });
            });
        }
    }

    // ============= BADGE PULSE ANIMATION =============
    
    class BadgePulse {
        constructor() {
            this.pulse = document.querySelector('.badge-pulse');
            
            if (!this.pulse) return;
            
            this.init();
        }

        init() {
            // Enhanced pulse effect on hover
            const badge = this.pulse.closest('.badge');
            if (!badge) return;

            badge.addEventListener('mouseenter', () => {
                this.pulse.style.animationDuration = '1s';
            });

            badge.addEventListener('mouseleave', () => {
                this.pulse.style.animationDuration = '2s';
            });
        }
    }

    // ============= PERFORMANCE: DISABLE TRANSITIONS DURING SCROLL =============
    
    class ScrollPerformance {
        constructor() {
            this.scrollTimer = null;
            this.isScrolling = false;
            this.init();
        }

        init() {
            window.addEventListener('scroll', throttle(() => {
                this.handleScroll();
            }, 10), { passive: true });
        }

        handleScroll() {
            if (!this.isScrolling) {
                this.isScrolling = true;
                document.body.classList.add('scrolling');
            }
            
            clearTimeout(this.scrollTimer);
            
            this.scrollTimer = setTimeout(() => {
                this.isScrolling = false;
                document.body.classList.remove('scrolling');
            }, 150);
        }
    }

    // ============= BLOB MOUSE TRACKING =============
    
    class BlobTracker {
        constructor() {
            this.blobs = document.querySelectorAll('.blob');
            
            if (this.blobs.length === 0) return;
            
            this.init();
        }

        init() {
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            const animate = () => {
                // Smooth following with easing
                targetX += (mouseX - targetX) * 0.05;
                targetY += (mouseY - targetY) * 0.05;

                this.blobs.forEach((blob, index) => {
                    const speed = 0.02 + (index * 0.01);
                    const currentX = parseFloat(blob.dataset.x || 0);
                    const currentY = parseFloat(blob.dataset.y || 0);
                    
                    const newX = currentX + (targetX - currentX) * speed;
                    const newY = currentY + (targetY - currentY) * speed;
                    
                    blob.dataset.x = newX;
                    blob.dataset.y = newY;
                    
                    // Subtle movement
                    blob.style.transform = `translate(${newX * 0.02}px, ${newY * 0.02}px) translateZ(0)`;
                });

                requestAnimationFrame(animate);
            };

            animate();
        }
    }

    // ============= TRUST INDICATORS COUNTER =============
    
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('.trust-number');
            this.animated = new Set();
            
            if (this.counters.length === 0) return;
            
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(element) {
            const text = element.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const targetValue = parseInt(text.replace(/\D/g, ''));
            
            if (isNaN(targetValue)) return;

            let currentValue = 0;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                currentValue = Math.floor(easeOutQuart * targetValue);
                
                let displayValue = currentValue.toLocaleString();
                if (hasPlus) displayValue += '+';
                if (hasPercent) displayValue += '%';
                
                element.textContent = displayValue;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = text; // Ensure exact final value
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // ============= FEATURE CARDS HOVER EFFECT =============
    
    class CardHoverEffect {
        constructor() {
            this.cards = document.querySelectorAll('.feat-card, .sub-card');
            
            if (this.cards.length === 0) return;
            
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                // Add will-change on hover for performance
                card.addEventListener('mouseenter', () => {
                    card.style.willChange = 'transform, box-shadow';
                });
                
                card.addEventListener('mouseleave', () => {
                    // Remove will-change after transition to free up resources
                    setTimeout(() => {
                        card.style.willChange = 'auto';
                    }, 400);
                });

                // 3D tilt effect on mouse move
                card.addEventListener('mousemove', throttle((e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    requestAnimationFrame(() => {
                        card.style.transform = `
                            perspective(1000px) 
                            rotateX(${rotateX}deg) 
                            rotateY(${rotateY}deg) 
                            translateY(-10px) 
                            translateZ(0)
                        `;
                    });
                }, 16));

                card.addEventListener('mouseleave', () => {
                    requestAnimationFrame(() => {
                        card.style.transform = '';
                    });
                });
            });
        }
    }

    // ============= P
