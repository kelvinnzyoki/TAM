document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://cctamcc.site";
    
    const signupForm = document.getElementById('signupForm');
    const verifyModal = document.getElementById('verifyModal');
    const resendBtn = document.getElementById('resendBtn');
    const timerText = document.getElementById('timerText');
    const secondsSpan = document.getElementById('seconds');
    const confirmBtn = document.getElementById('confirmBtn');
    const verifyCodeInput = document.getElementById('verifyCode');

    let countdown;

    // --- 1. TOAST NOTIFICATION SYSTEM ---
    function showToast(message, type = "info") {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        // Animate
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- 2. SEND VERIFICATION CODE ---
    signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const username = document.getElementById('username').value.trim();
    const dob = document.getElementById('dob').value;
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast("Invalid email format", "error");
        return;
    }

    // Field validation
    if (!email || !username || !password || !dob) {
        showToast("All fields are required", "error");
        return;
    }

    if (password.length < 8) {
        showToast("Password must be at least 8 characters", "error");
        return;
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending Code...";

    try {
        const res = await fetch(`${SERVER_URL}/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            verifyModal.style.display = 'flex';
            startResendTimer();
            showToast("✅ Verification code sent to your email", "success");
        } else if (res.status === 409) {
            // ✅ EMAIL ALREADY REGISTERED
            showToast("⚠️ This email is already registered. Redirecting to login...", "error");
            setTimeout(() => {
                window.location.href = "/TAM/index.html"; // Your login page
            }, 2500);
        } else {
            showToast(data.message || "Error sending code", "error");
        }
    } catch (err) {
        console.error("❌ Send code error:", err);
        showToast("Server connection failed", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "INITIALIZE SYSTEM";
    }
});

    // --- 3. TIMER LOGIC ---
    function startResendTimer() {
        let timeLeft = 60;
        secondsSpan.innerText = timeLeft;
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

    // --- 4. RESEND CODE ---
    resendBtn.onclick = async () => {
        const email = document.getElementById('email').value.trim();
        
        resendBtn.disabled = true;  // ✅ FIXED: Should be TRUE
        resendBtn.innerText = "Sending...";

        try {
            const res = await fetch(`${SERVER_URL}/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                startResendTimer();
                showToast("New code sent", "success");
            } else {
                showToast("Failed to resend code", "error");
                resendBtn.disabled = false;
                resendBtn.innerText = "RESEND CODE";
            }
        } catch (err) {
            showToast("Connection failed", "error");
            resendBtn.disabled = false;
            resendBtn.innerText = "RESEND CODE";
        }
    };


// show/hide password 
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Optional: Change icon color when active
    togglePassword.style.color = type === 'text' ? 'var(--primary)' : 'var(--text-secondary)';
});

    // --- 5. VERIFY CODE AND CREATE ACCOUNT ---
    confirmBtn.onclick = async () => {
        const code = verifyCodeInput.value.trim();
        
        if (!code || code.length !== 6) {
            showToast("Please enter the 6-digit code", "error");
            return;
        }

        const payload = {
            email: document.getElementById('email').value.trim(),
            code: code,
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value.trim(),
            dob: document.getElementById('dob').value
        };

        confirmBtn.disabled = true;
        confirmBtn.innerText = "Verifying...";

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
                
                // Hide modal, show success
                verifyModal.style.display = 'none';
                const successOverlay = document.getElementById('successOverlay');
                if (successOverlay) {
                    successOverlay.style.display = 'flex';
                }
                
                showToast("🔥 ACCOUNT CREATED! WELCOME, ALPHA.", "success");
                
                setTimeout(() => {
                    window.location.href = "/TAM/index2.html";
                }, 2500);
                
            } else {
                // Show specific error messages
                const message = data.message || "";

                if (message.includes("already registered")) {
                    showToast("⚠️ Email already registered. Try logging in.", "error");
                } else if (message.includes("already taken")) {
                    showToast("⚠️ Username taken. Choose another.", "error");
                } else {
                    showToast(message || "Invalid verification code", "error");
                }
                
                confirmBtn.disabled = false;
                confirmBtn.innerText = "CONFIRM CODE";
            }
        } catch (err) {
            console.error("Signup error:", err);
            showToast("Signup failed. Check connection.", "error");
            confirmBtn.disabled = false;
            confirmBtn.innerText = "CONFIRM CODE";
        }
    };

    console.log("✅ Signup page initialized");
});
