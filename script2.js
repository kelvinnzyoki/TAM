document.addEventListener('DOMContentLoaded', () => {
    // ============= ELEMENT REFERENCES =============
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // ============= MODAL CONTROL (OPTIMIZED) =============
    // Open Modal when Header Logout is clicked
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Use requestAnimationFrame for smooth modal opening
            requestAnimationFrame(() => {
                logoutModal.style.display = 'flex';
                // Add class for animation if needed
                setTimeout(() => {
                    logoutModal.classList.add('modal-open');
                }, 10);
            });
        });
    }

    // Close Modal when Cancel is clicked
    if (cancelLogout) {
        cancelLogout.onclick = () => {
            logoutModal.classList.remove('modal-open');
            setTimeout(() => {
                logoutModal.style.display = 'none';
            }, 200);
        };
    }

    // Handle Final Logout
    if (confirmLogout) {
        confirmLogout.onclick = async () => {
            try {
                // Change UI to show it's working
                confirmLogout.innerText = "TERMINATING...";
                confirmLogout.disabled = true;

                // Call logout API
                await API.logout(); 
                
                // Clear local storage
                localStorage.clear();
                
                // Redirect on success
                window.location.replace("index0.html");
            } catch (err) {
                console.error("Logout error:", err);
                // Fallback: Clear local data and force redirect
                localStorage.clear();
                window.location.replace("index0.html");
            }
        };
    }

    // Close modal if user clicks outside the modal box
    window.onclick = (event) => {
        if (event.target == logoutModal) {
            logoutModal.classList.remove('modal-open');
            setTimeout(() => {
                logoutModal.style.display = 'none';
            }, 200);
        }
    };

    // Initialize the rest of the dashboard
    loadDashboard();
});

// ============= DASHBOARD LOADING (OPTIMIZED) =============
async function loadDashboard() {
    const scoreDisplay = document.getElementById("totalScoreDisplay");

    if (!scoreDisplay) {
        console.error("Score display element not found");
        return;
    }

    try {
        const data = await API.request("/total-score");

        if (data && typeof data.total_score !== 'undefined') {
            // Use optimized animation
            animateValue(scoreDisplay, 0, data.total_score, 1000);
        } else {
            scoreDisplay.innerText = "0";
        }
    } catch (err) {
        console.error("Dashboard error:", err);
        scoreDisplay.innerText = "--";
        
        // Show error toast if available
        if (typeof showToast === 'function') {
            showToast("Failed to load score", "error");
        }
    }
}

// ============= OPTIMIZED NUMBER ANIMATION =============
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Use easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * (end - start) + start);
        
        obj.innerHTML = currentValue;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Ensure final value is exact
            obj.innerHTML = end;
        }
    };
    
    window.requestAnimationFrame(step);
}

// ============= PERFORMANCE: LAZY LOAD IMAGES =============
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before element enters viewport
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

// ============= PERFORMANCE: DEBOUNCE HELPER =============
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

// ============= PERFORMANCE: THROTTLE HELPER =============
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

// ============= PERFORMANCE: DISABLE TRANSITIONS DURING SCROLL =============
let scrollTimer = null;
let isScrolling = false;

const handleScrollPerformance = () => {
    if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('scrolling');
    }
    
    clearTimeout(scrollTimer);
    
    scrollTimer = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('scrolling');
    }, 150);
};

// Use passive event listener for better performance
window.addEventListener('scroll', throttle(handleScrollPerformance, 10), { passive: true });

// ============= CARD HOVER PERFORMANCE =============
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.category-card, .action-card');
    
    cards.forEach(card => {
        // Add will-change on hover for better performance
        card.addEventListener('mouseenter', () => {
            card.style.willChange = 'transform';
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove will-change after animation to free up resources
            setTimeout(() => {
                card.style.willChange = 'auto';
            }, 400);
        });
    });
});

// ============= SMOOTH SCROLL TO TOP =============
function scrollToTop(duration = 600) {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const easeInOutCubic = t => t < 0.5 
        ? 4 * t * t * t 
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition * (1 - ease));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ============= NETWORK ERROR HANDLING =============
window.addEventListener('online', () => {
    console.log('Connection restored');
    if (typeof showToast === 'function') {
        showToast('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    if (typeof showToast === 'function') {
        showToast('No internet connection', 'error');
    }
});

// ============= PERFORMANCE MONITORING (DEV ONLY) =============
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            console.log(`FPS: ${fps}`);
            
            if (fps < 50) {
                console.warn('Low FPS detected. Check for performance issues.');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
}

// ============= CLEANUP ON PAGE UNLOAD =============
window.addEventListener('beforeunload', () => {
    // Clear any running timers
    if (scrollTimer) clearTimeout(scrollTimer);
    
    // Remove event listeners to prevent memory leaks
    window.removeEventListener('scroll', handleScrollPerformance);
});

// ============= EXPORT UTILITIES (IF NEEDED) =============
window.DashboardUtils = {
    animateValue,
    debounce,
    throttle,
    scrollToTop
};
    
