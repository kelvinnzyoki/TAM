// SIGN UP PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  
  // Define URL once at the top
  const SERVER_URL = "https://mybackend-production-b618.up.railway.app/signup";

  class SignupForm {
    constructor() {
      // Ensure these IDs match your HTML exactly
      this.form = document.getElementById("signupForm");
      this.usernameInput = document.getElementById("username");
      this.emailInput = document.getElementById("email");
      this.passwordInput = document.getElementById("password");
      this.dobSelect = document.getElementById("dob");
      //this.submitBtn = document.getElementById("submitBtn");
      
      this.initialize();
    }

    initialize() {
      if (!this.form) {
        console.error("Form not found! Check your HTML ID.");
        return;
      }

      this.form.addEventListener("submit", (e) => {
        e.preventDefault(); 

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
      if (!dob === "Select") {
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

      const submitBtn = document.getElementById("submitBtn");
      if (this.submitBtn) this.submitBtn.disabled = true;

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

        alert(data.message || "🎉 Account created successfully!");
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
        if (this.submitBtn) this.submitBtn.disabled = false;
      }
    }
  }

  // ---------------- CREATE INSTANCE ----------------
  new SignupForm();
});
