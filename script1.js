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

    // 1. Initial Signup Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    // ... other variables ...

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
        } else {
            showToast(data.message || "Error sending code.", "error");
        }
    } catch (err) {
        console.error("❌ Fetch error:", err);
        showToast("Server connection failed.", "error"); // Fixed syntax here
    }
});

    // 2. Timer Logic
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

    // 3. Resend Logic
    resendBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        const res = await fetch(`${SERVER_URL}/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (res.ok) startResendTimer();
    };

// 4. Final Verification and Signup
confirmBtn.onclick = async () => {
    // ... payload construction ...

    try {
        const res = await fetch(`${SERVER_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include' // Added for cross-domain cookie support
        });

        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem("username", payload.username);
            verifyModal.style.display = 'none';
            // showToast handles redirect to index2.html
            showToast("🔥 ACCOUNT VERIFIED. WELCOME, ALPHA.", "success");
        } else {
            showToast(data.message || "Invalid Code.", "error");
            confirmBtn.disabled = false;
            confirmBtn.innerText = "Confirm";
        }
    } catch (err) {
        showToast("Signup failed. Check connection.", "error");
        confirmBtn.disabled = false;
        confirmBtn.innerText = "Confirm";
    }
};
    

    
});
