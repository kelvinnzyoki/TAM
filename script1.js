document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://mybackend-production-b618.up.railway.app";
    
    const signupForm = document.getElementById('signupForm');
    const verifyModal = document.getElementById('verifyModal');
    const resendBtn = document.getElementById('resendBtn');
    const timerText = document.getElementById('timerText');
    const secondsSpan = document.getElementById('seconds');
    const confirmBtn = document.getElementById('confirmBtn');
    const verifyCodeInput = document.getElementById('verifyCode');

    let countdown;

    // 1. Initial Signup Submission (Triggers Email)
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const username = document.getElementById('username').value.trim();
        const dob = document.getElementById('dob').value;
        if (!email || !username || !password || !dob) {
            alert("All fields required");
            return;
        }



        try {
            const res = await fetch(`${SERVER_URL}/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                verifyModal.style.display = 'flex';
                startResendTimer();
            } else {
                const data = await res.json();
                alert(data.message || "Error sending code.");
            }
        } catch (err) {
            alert("Server connection failed.");
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
        const payload = {
            email: document.getElementById('email').value,
            code: verifyCodeInput.value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            dob: document.getElementById('dob').value
        
        };
        
        localStorage.setItem("userEmail", payload.email);
        localStorage.setItem("username", payload.username);
        
        
        try {
            const res = await fetch(`${SERVER_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                verifyModal.style.display = 'none';
                document.getElementById('successOverlay').style.display = 'flex';
                setTimeout(() => window.location.href = "index.html", 2500);
            } else {
                const data = await res.json();
                alert(data.message || "Invalid Code.");
            }
        } catch (err) {
            alert("Signup failed. Check connection.");
        }
    };
});
