document.addEventListener("DOMContentLoaded", async () => {
    const SERVER_URL = "https://api.cctamcc.site";
    
    // ============= SESSION CHECK: REDIRECT IF ALREADY LOGGED IN =============
    const existingSession = await API.checkSession();
    if (existingSession && existingSession.authenticated) {
        console.log("Already logged in, redirecting to dashboard...");
        showToast("You're already logged in!", "info");
        setTimeout(() => {
            window.location.replace("index2.html");
        }, 1000);
        return;
    }
    
    // ============= UI ELEMENTS =============
    const signupForm = document.getElementById('signupForm');
    const verifyModal = document.getElementById('verifyModal');
    const resendBtn = document.getElementById('resendBtn');
    const timerText = document.getElementById('timerText');
    const secondsSpan = document.getElementById('seconds');
    const confirmBtn = document.getElementById('confirmBtn');
    const verifyCodeInput = document.getElementById('verifyCode');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const usernameInput = document.getElementById('username');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const meterContainer = document.querySelector('.strength-meter');

    let countdown;

    // ============= HELPER: DEBOUNCE =============
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

    // ============= HELPER: PASSWORD VALIDATION =============
    function validatePassword(pass) {
        const minLength = 8;
        if (pass.length < minLength) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(pass)) return "Missing uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Missing lowercase letter.";
        if (!/[0-9]/.test(pass)) return "Missing a number.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Missing a special character.";
        return null;
    }

    // ============= USERNAME VALIDATION =============
    function validateUsername(username) {
        if (!username || username.length < 3) {
            return "Username must be at least 3 characters.";
        }
        if (username.length > 20) {
            return "Username must be 20 characters or less.";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers, and underscores.";
        }
        return null;
    }

    // ============= CHECK USERNAME AVAILABILITY =============
    async function checkUsernameAvailability(username) {
        try {
            const res = await fetch(`${SERVER_URL}/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            
            const data = await res.json();
            return data.available;
        } catch (err) {
            console.error("Username check error:", err);
            return null;
        }
    }

    // ============= LIVE USERNAME VALIDATION =============
    const checkUsernameDebounced = debounce(async (username) => {
        const usernameError = document.getElementById('usernameError');
        const usernameSuccess = document.getElementById('usernameSuccess');
        
        if (usernameError) usernameError.style.display = 'none';
        if (usernameSuccess) usernameSuccess.style.display = 'none';
        usernameInput.classList.remove('valid', 'invalid');
        
        const formatError = validateUsername(username);
        if (formatError) {
            if (usernameError) {
                usernameError.textContent = formatError;
                usernameError.style.display = 'block';
            }
            usernameInput.classList.add('invalid');
            return;
        }
        
        const available = await checkUsernameAvailability(username);
        
        if (available === null) {
            usernameInput.classList.remove('valid', 'invalid');
            return;
        }
        
        if (!available) {
            if (usernameError) {
                usernameError.textContent = '❌ Username already taken';
                usernameError.style.display = 'block';
            }
            usernameInput.classList.add('invalid');
        } else {
            if (usernameSuccess) {
                usernameSuccess.textContent = '✅ Username available';
                usernameSuccess.style.display = 'block';
            }
            usernameInput.classList.add('valid');
        }
    }, 500);

    // Attach username input listener
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length > 0) {
                checkUsernameDebounced(val);
            } else {
                const usernameError = document.getElementById('usernameError');
                const usernameSuccess = document.getElementById('usernameSuccess');
                if (usernameError) usernameError.style.display = 'none';
                if (usernameSuccess) usernameSuccess.style.display = 'none';
                usernameInput.classList.remove('valid', 'invalid');
            }
        });
    }

    // ============= PASSWORD TOGGLE =============
    if (togglePassword && passwordInput) {
        console.log("✅ Password toggle initialized");
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.style.color = type === 'text' ? 'var(--primary)' : 'var(--text-secondary)';
            console.log(`Password visibility: ${type}`);
        });
    } else {
        console.error("❌ Password toggle or input not found!");
    }

    // ============= PASSWORD STRENGTH METER =============
    const updatePasswordStrength = debounce((val) => {
        if (!meterContainer || !strengthBar || !strengthText) {
            console.error("❌ Strength meter elements not found!");
            return;
        }

        if (val.length > 0) {
            meterContainer.style.display = 'block';
            console.log("✅ Strength meter visible");
        } else {
            meterContainer.style.display = 'none';
            strengthText.innerText = '';
            return;
        }

        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) score++;

        strengthBar.className = 'strength-bar';
        
        requestAnimationFrame(() => {
            switch (score) {
                case 1:
                    strengthBar.classList.add('weak');
                    strengthText.innerText = 'Weak';
                    strengthText.style.color = '#ff4d4d';
                    break;
                case 2:
                    strengthBar.classList.add('medium');
                    strengthText.innerText = 'Moderate';
                    strengthText.style.color = '#fbbf24';
                    break;
                case 3:
                    strengthBar.classList.add('strong');
                    strengthText.innerText = 'Strong';
                    strengthText.style.color = '#3b82f6';
                    break;
                case 4:
                    strengthBar.classList.add('alpha');
                    strengthText.innerText = 'Alpha Level';
                    strengthText.style.color = 'var(--primary)';
                    break;
                default:
                    strengthBar.classList.add('weak');
                    strengthText.innerText = 'Too Short';
                    strengthText.style.color = '#ff4d4d';
            }
            console.log(`Password strength: ${strengthText.innerText}`);
        });
    }, 150);

    if (passwordInput) {
        console.log("✅ Password strength listener initialized");
        passwordInput.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
        });
    } else {
        console.error("❌ Password input not found!");
    }

    // ============= SEND CODE =============
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            const usernameError = validateUsername(username);
            if (usernameError) {
                showToast(usernameError, "error");
                usernameInput.focus();
                return;
            }
            
            const available = await checkUsernameAvailability(username);
            if (available === false) {
                showToast("Username is already taken. Please choose another.", "error");
                usernameInput.focus();
                return;
            }
            
            const passwordError = validatePassword(password);
            if (passwordError) {
                showToast(passwordError, "error");
                passwordInput.focus();
                return;
            }

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerText = "SENDING...";

            try {
                const data = await API.sendCode(email);
                
                if (data.success) {
                    verifyModal.style.display = 'flex';
                    startResendTimer();
                    showToast("Verification code sent!", "success");
                    
                    setTimeout(() => {
                        if (verifyCodeInput) verifyCodeInput.focus();
                    }, 300);
                }
            } catch (err) {
                console.error("Send code error:", err);
                showToast(err.message || "Server connection failed", "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "INITIALIZE SYSTEM";
            }
        });
    }

    // ============= AUTO-SUBMIT VERIFICATION =============
    if (verifyCodeInput) {
        verifyCodeInput.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val;
            
            if (val.length === 6) {
                setTimeout(() => {
                    if (confirmBtn) confirmBtn.click();
                }, 300);
            }
        });
    }

    // ============= FINAL SIGNUP =============
    if (confirmBtn) {
        confirmBtn.onclick = async () => {
            const payload = {
                email: document.getElementById('email').value.trim(),
                code: verifyCodeInput.value.trim(),
                username: usernameInput.value.trim(),
                password: passwordInput.value.trim(),
                dob: document.getElementById('dob').value
            };

            if (!payload.code || payload.code.length !== 6) {
                showToast("Please enter the 6-digit code", "error");
                return;
            }

            confirmBtn.disabled = true;
            confirmBtn.innerText = "VERIFYING...";

            try {
                const data = await API.signup(payload);
                
                if (data.success) {
                    localStorage.setItem("username", payload.username);
                    verifyModal.style.display = 'none';
                    
                    const successOverlay = document.getElementById('successOverlay');
                    if (successOverlay) {
                        successOverlay.style.display = 'flex';
                    }
                    
                    showToast("🔥 WELCOME, ALPHA.", "success");
                    
                    setTimeout(() => {
                        window.location.replace("index2.html");
                    }, 2000);
                }
            } catch (err) {
                console.error("Signup error:", err);
                showToast(err.message || "Invalid code", "error");
                confirmBtn.disabled = false;
                confirmBtn.innerText = "Confirm";
                
                verifyCodeInput.value = '';
                verifyCodeInput.focus();
            }
        };
    }

    // ============= RESEND TIMER =============
    function startResendTimer() {
        let timeLeft = 60;
        
        if (resendBtn) resendBtn.style.display = 'none';
        if (timerText) timerText.style.display = 'block';
        
        clearInterval(countdown);
        
        countdown = setInterval(() => {
            timeLeft--;
            if (secondsSpan) secondsSpan.innerText = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                if (timerText) timerText.style.display = 'none';
                if (resendBtn) resendBtn.style.display = 'inline-block';
            }
        }, 1000);
    }

    // ============= RESEND CODE =============
    if (resendBtn) {
        resendBtn.addEventListener('click', async () => {
            const email = document.getElementById('email').value.trim();
            
            resendBtn.disabled = true;
            resendBtn.innerText = 'SENDING...';

            try {
                await API.sendCode(email);
                startResendTimer();
                showToast("New code sent!", "success");
            } catch (err) {
                console.error("Resend error:", err);
                showToast(err.message || "Connection failed", "error");
                resendBtn.disabled = false;
                resendBtn.innerText = 'RESEND CODE';
            }
        });
    }

    // ============= CLEANUP ON PAGE UNLOAD =============
    window.addEventListener('beforeunload', () => {
        if (countdown) clearInterval(countdown);
    });

    // ============= INITIALIZATION LOG =============
    console.log("🚀 Signup page initialized");
    console.log("✅ Password toggle:", togglePassword ? "Found" : "NOT FOUND");
    console.log("✅ Password input:", passwordInput ? "Found" : "NOT FOUND");
    console.log("✅ Strength meter:", meterContainer ? "Found" : "NOT FOUND");
    console.log("✅ Strength bar:", strengthBar ? "Found" : "NOT FOUND");
    console.log("✅ Strength text:", strengthText ? "Found" : "NOT FOUND");
});
            
