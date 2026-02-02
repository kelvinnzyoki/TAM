document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://cctamcc.site";

    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");
    const submitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

    if (loginBtn) loginBtn.onclick = () => loginModal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => loginModal.style.display = "none";
    
    window.onclick = (e) => { 
        if(e.target == loginModal) loginModal.style.display = "none"; 
    };

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }
    
    if (!submitBtn) {
        console.error("Submit button not found!");
        return;
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.innerText = message;
        toast.className = "show";
    }
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        if (!email || !password) {
            showToast("Email and password required");
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = "AUTHORIZING...";

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                submitBtn.innerText = "SUCCESS!";
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", data.user.username);
                
                // Wait 0.5s, then hide and navigate
                setTimeout(() => { 
                    toast.className = toast.className.replace("show", "");
                    window.location.href = "index2.html";
                }, 500);
            } else {
                showToast(data.message || "Login Failed");
                submitBtn.innerText = "ENTER SYSTEM";
                submitBtn.disabled = false;
            }
        } catch (err) {
            console.error("Login error:", err);
            showToast("Server Offline or Connection Failed. Please try later.");
            submitBtn.innerText = "ENTER SYSTEM";
            submitBtn.disabled = false;
        }
    });

    // ============= OPTIMIZED SCROLL EFFECT =============
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
    const emailInput = document.getElementById("email");
    const passwordInputField = document.getElementById("password");

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !email.includes('@')) {
                emailInput.style.borderColor = '#ff4d4d';
            } else {
                emailInput.style.borderColor = '';
            }
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
    }
});
                
