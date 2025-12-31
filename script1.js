// SIGN UP PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  
  // Define URL once at the top
const SERVER_URL = "https://mybackend-production-b618.up.railway.app/signup";
const signupForm = document.getElementById('signupForm');
const verifyModal = document.getElementById('verifyModal');
const resendBtn = document.getElementById('resendBtn');
const timerText = document.getElementById('timerText');
const secondsSpan = document.getElementById('seconds');
const confirmBtn = document.getElementById('confirmBtn');

  class SignupForm {
    constructor() {
      // Ensure these IDs match your HTML exactly
      this.form = document.getElementById("signupForm");
      this.usernameInput = document.getElementById("username");
      this.emailInput = document.getElementById("email");
      this.passwordInput = document.getElementById("password");
      this.dobSelect = document.getElementById("dob");
      this.signupBtn = document.getElementById("signupBtn");
      
      this.initialize();
    }

    initialize() {
      if (!this.form) {
        console.error("Form not found! Check your HTML ID.");
        return;
      }

      //this.form.addEventListener("submit", (e) => {
        //e.preventDefault();

let countdown;
      // 1. Initial Signup Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    const res = await fetch('https://mybackend-production-b618.up.railway.app/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    if (res.ok) {
        verifyModal.style.display = 'flex';
        startResendTimer();
    } else {
        alert("Error sending code. Please try again.");
    }
});

      // 2. Resend Timer Logic
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

      // 3. Resend Button Click
resendBtn.onclick = async () => {
    const email = document.getElementById('email').value;
    const res = await fetch('https://your-backend.railway.app/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (res.ok) startResendTimer();
};
      // 4. Final Verification and Success Animation
confirmBtn.onclick = async () => {
    const code = document.getElementById('verifyCode').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;

    const res = await fetch('https://your-backend.railway.app/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, username, password, dob })
    });

    if (res.ok) {
        verifyModal.style.display = 'none';
        document.getElementById('successOverlay').style.display = 'flex';
      
      // Wait for animation then redirect
        setTimeout(() => {
            window.location.href = "index.html"; 
        }, 2500);
    } else {
        alert("Invalid Security Code.");
    }
};

        if (this.validateForm()) {
          this.submitForm();
        }
      });
    }

    // ---------------- VALIDATION LOGIC ----------------
    validateForm() {
      const username = this.usernameInput.value.trim();
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value.trim();
      const dob = this.dobSelect.value;

      if (!username) {
        alert("Please enter a username.");
        return false;
      }

      if (!this.isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return false;
      }

      if (password.length < 8) {
        alert("Password must be at least 8 characters long for better security.");
        return false;
      }

      // Check for empty string or "Select"
      if (!dob || dob === "Select") {
        alert("Please choose your year of birth.");
        return false;
      }

      return true;
    }

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ---------------- SAVE USER + REDIRECT ----------------
    async submitForm() {
      const userData = {
        username: this.usernameInput.value.trim(),
        email: this.emailInput.value.trim(),
        password: this.passwordInput.value.trim(),
        dob: this.dobSelect.value,
      };

      
      if (this.signupBtn) this.signupBtn.disabled = true;

      const controller = new AbortController();
      // Increased to 30 seconds to prevent "Signal Aborted" on slow Railway wake-ups
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(SERVER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(userData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          // This catches 400, 409, and 500 errors from your backend
          throw new Error(data.message || "Signup failed");
        }

        alert(data.message || "Account created successfully!");
        this.form.reset();
        window.location.href = "index.html";

      } catch (error) {
        // FIXED: Changed error.username to error.name
        if (error.name === "AbortError") {
          alert("Request timed out. The server is taking too long to respond.");
        } else {
          console.error("Signup error details:", error);
          alert(error.message || "Signup failed. Please try again.");
        }
      } finally {
        if (this.signupBtn) this.signupBtn.disabled = false;
      }
    }
  }

  // ---------------- CREATE INSTANCE ----------------
  new SignupForm();
});
