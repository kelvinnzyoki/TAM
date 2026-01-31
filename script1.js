document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://cctamcc.site";
    
    // UI Elements
    const signupForm = document.getElementById('signupForm');
    const verifyModal = document.getElementById('verifyModal');
    const resendBtn = document.getElementById('resendBtn');
    const timerText = document.getElementById('timerText');
    const secondsSpan = document.getElementById('seconds');
    const confirmBtn = document.getElementById('confirmBtn');
    const verifyCodeInput = document.getElementById('verifyCode');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    let countdown;

    // --- HELPER: PASSWORD VALIDATION ---
    function validatePassword(pass) {
        const minLength = 8;
        if (pass.length < minLength) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(pass)) return "Missing uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Missing lowercase letter.";
        if (!/[0-9]/.test(pass)) return "Missing a number.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Missing a special character.";
        return null;
    }

    // --- HELPER: TOAST SYSTEM ---
    function showToast(message, type = "info") {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- LOGIC: PASSWORD TOGGLE ---
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.style.color = type === 'text' ? 'var(--primary)' : 'var(--text-secondary)';
        
    });



    // --- LOGIC: PASSWORD STRENGTH METER ---
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const meterContainer = document.querySelector('.strength-meter');

    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        
        // Show/Hide meter container
        if (val.length > 0) {
            meterContainer.style.display = 'block';
        } else {
            meterContainer.style.display = 'none';
            strengthText.innerText = '';
            return;
        }

        // Calculate Score
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) score++;

        // Reset classes
        strengthBar.className = 'strength-bar';
        
        // Update UI based on score
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
    });

    // --- LOGIC: SEND CODE ---
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value.trim();
        
        const passwordError = validatePassword(password);
        if (passwordError) {
            showToast(passwordError, "error");
            return;
        }

        const submitBtn = signupForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = "SENDING...";

        try {
            const res = await fetch(`${SERVER_URL}/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                verifyModal.style.display = 'flex';
                startResendTimer();
                showToast("Verification code sent!", "success");
            } else {
                showToast(data.message || "Error", "error");
            }
        } catch (err) {
            showToast("Server connection failed", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "INITIALIZE SYSTEM";
        }
    });

    // --- LOGIC: AUTO-SUBMIT VERIFICATION ---
    verifyCodeInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
        if (val.length === 6) {
            setTimeout(() => confirmBtn.click(), 300);
        }
    });

    // --- LOGIC: FINAL SIGNUP ---
    confirmBtn.onclick = async () => {
        const payload = {
            email: document.getElementById('email').value.trim(),
            code: verifyCodeInput.value.trim(),
            username: document.getElementById('username').value.trim(),
            password: passwordInput.value.trim(),
            dob: document.getElementById('dob').value
        };

        confirmBtn.disabled = true;
        confirmBtn.innerText = "VERIFYING...";

        try {
            const res = await fetch(`${SERVER_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                localStorage.setItem("username", payload.username);
                verifyModal.style.display = 'none';
                showToast("🔥 WELCOME, ALPHA.", "success");
                setTimeout(() => window.location.href = "/TAM/index2.html", 2000);
            } else {
                showToast(data.message || "Invalid code", "error");
                confirmBtn.disabled = false;
                confirmBtn.innerText = "CONFIRM CODE";
            }
        } catch (err) {
            showToast("Connection lost", "error");
            confirmBtn.disabled = false;
        }
    };

    // --- LOGIC: TIMER ---
    function startResendTimer() {
        let timeLeft = 60;
        resendBtn.style.display = 'none';
        timerText.style.display = 'block';
        clearInterval(countdown);
        countdown = setInterval(() => {
            timeLeft--;
            secondsSpan.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerText.style.display = 'none';
                resendBtn.style.display = 'inline-block';
            }
        }, 1000);
    }
});
