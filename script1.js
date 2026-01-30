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

    

    // --- 2. SEND VERIFICATION CODE ---
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const username = document.getElementById('username').value.trim();
        const dob = document.getElementById('dob').value;
        
        // Validation
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
            } else {
                showToast(data.message || "Error sending code", "error");
            }
        } catch (err) {
            console.error("❌ Send code error:", err);
            showToast("Server connection failed", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Code";
        }
    });

    // --- 3. TIMER LOGIC ---
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

    // --- 4. RESEND CODE ---
    resendBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        
        resendBtn.disabled = true;
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
                resendBtn.innerText = "Resend Code";
            }
        } catch (err) {
            showToast("Connection failed", "error");
            resendBtn.disabled = false;
            resendBtn.innerText = "Resend Code";
        }
    };

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
    dob: `${document.getElementById('dob').value}-01-01` // ✅ Convert year to date
};

        confirmBtn.disabled = true;
        confirmBtn.innerText = "Verifying...";

        try {
            const res = await fetch(`${SERVER_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ✅ CRITICAL for cookies
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
    localStorage.setItem("username", payload.username);
    showToast("🔥 ACCOUNT CREATED! WELCOME, ALPHA.", "success");
    
    setTimeout(() => {
        window.location.href = "/TAM/index2.html";
    }, 2500);
    
} else {
    // Show specific error messages from server
    if (data.message.includes("already registered")) {
        showToast("⚠️ Email already registered. Try logging in.", "error");
    } else if (data.message.includes("already taken")) {
        showToast("⚠️ Username taken. Choose another.", "error");
    } else {
        showToast(data.message || "Invalid verification code", "error");
    }
    
    confirmBtn.disabled = false;
    confirmBtn.innerText = "Confirm";
            }
});
