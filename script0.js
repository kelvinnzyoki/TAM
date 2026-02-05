document.addEventListener("DOMContentLoaded", async () => {
    const SERVER_URL = "https://api.cctamcc.site";

    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");
    const submitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

    // ============= SESSION CHECK ON LOAD =============
    // Check if user is already logged in
    async function checkExistingSession() {
        try {
            // Use the checkAuth function from API module
            const authStatus = await API.checkAuth();
            
            if (authStatus && authStatus.authenticated) {
                console.log("✅ Active session detected");
                
                // Update login button to show dashboard link
                if (loginBtn) {
                    loginBtn.innerText = "DASHBOARD";
                    loginBtn.onclick = (e) => {
                        e.preventDefault();
                        window.location.replace("index2.html");
                    };
                }
                
                return true;
            } else {
                console.log("No active session found");
                return false;
            }
        } catch (err) {
            console.log("Session check error:", err);
            return false;
        }
    }

    // Run session check on page load
    await checkExistingSession();

    // ============= MODAL CONTROLS =============
    if (loginBtn) {
        loginBtn.onclick = (e) => {
            e.preventDefault();
            // If already logged in, button redirects to dashboard (set above)
            // Otherwise, open login modal
            if (loginBtn.innerText === "DASHBOARD") {
                window.location.replace("index2.html");
            } else {
                loginModal.style.display = "block";
            }
        };
    }
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            loginModal.style.display = "none";
        };
    }
    
    // Close modal when clicking outside
    window.onclick = (e) => { 
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }
    };

    // ============= FORM VALIDATION =============
    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }
    
    if (!submitBtn) {
        console.error("Submit button not found!");
        return;
    }

    // Toast notification helper
    function showToast(message, type = 'info') {
        const toast = document.getElementById("toast");
        if (!toast) return;
        
        toast.innerText = message;
        toast.className = `show ${type}`;
        
        setTimeout(() => {
            toast.className = "";
        }, 3000);
    }

    // ============= LOGIN FORM HANDLER =============
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        // Validation
        if (!email || !password) {
            showToast("Email and password required", "error");
            return;
        }

        if (!email.includes('@')) {
            showToast("Please enter a valid email", "error");
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = "AUTHORIZING...";

        try {
            // Use the API.login method from auth.js
            const data = await API.login(email, password);

            if (data.success) {
                submitBtn.innerText = "SUCCESS!";
                
                // Store username in localStorage
                if (data.user && data.user.username) {
                    localStorage.setItem("username", data.user.username);
                }
                
                showToast("Login successful! Redirecting...", "success");
                
                // Close modal and redirect
                setTimeout(() => { 
                    loginModal.style.display = "none";
                    window.location.replace("index2.html");
                }, 800);
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            
            // Show specific error message
            const errorMessage = err.message || "Server offline or connection failed";
            showToast(errorMessage, "error");
            
            // Reset button
            submitBtn.innerText = "ENTER SYSTEM";
            submitBtn.disabled = false;
        }
    });

    // ============= OPTIMIZED SCROLL EFFECT =============
    // Throttle function for scroll events (more efficient)
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

    // Optimized scroll handler with throttle
    const nav = document.querySelector('nav');
    
    if (nav) {
        let lastScrollY = 0;
        let ticking = false;

        const updateNav = (scrollY) => {
            // Use requestAnimationFrame for smooth updates
            if (scrollY > 50) {
                nav.style.background = 'rgba(5, 5, 5, 0.95)';
                nav.style.padding = '15px 0';
            } else {
                nav.style.background = 'rgba(5, 5, 5, 0.8)';
                nav.style.padding = '20px 0';
            }
            ticking = false;
        };

        const onScroll = () => {
            lastScrollY = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateNav(lastScrollY);
                });
                ticking = true;
            }
        };

        // Use passive event listener for better scroll performance
        window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    }

    // ============= PERFORMANCE: DISABLE TRANSITIONS DURING SCROLL =============
    let scrollTimer = null;
    let isScrolling = false;

    const handleScrollStart = () => {
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

    window.addEventListener('scroll', throttle(handleScrollStart, 10), { passive: true });

    // ============= FORM VALIDATION FEEDBACK =============
    // Debounce function to prevent excessive function calls
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

    const emailInput = document.getElementById("email");
    const passwordInputField = document.getElementById("password");

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !email.includes('@')) {
                emailInput.style.borderColor = '#ff4d4d';
                showToast("Invalid email format", "error");
            } else {
                emailInput.style.borderColor = '';
            }
        });

        // Clear error on focus
        emailInput.addEventListener('focus', () => {
            emailInput.style.borderColor = '';
        });
    }

    if (passwordInputField) {
        passwordInputField.addEventListener('input', debounce(() => {
            if (passwordInputField.value.length > 0 && passwordInputField.value.length < 6) {
                passwordInputField.style.borderColor = '#fbbf24';
            } else {
                passwordInputField.style.borderColor = '';
            }
        }, 300));

        // Clear error on focus
        passwordInputField.addEventListener('focus', () => {
            passwordInputField.style.borderColor = '';
        });
    }

    // ============= ENTER KEY SUPPORT =============
    // Allow Enter key to submit form from email or password field
    [emailInput, passwordInputField].forEach(input => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            });
        }
    });
});
                   
