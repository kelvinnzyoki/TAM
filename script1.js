// SIGN UP PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  const SERVER_URL = "https://mybackend-production-b618.up.railway.app/signup";

  class SignupForm {
    constructor() {
      this.form = document.querySelector("form");
      this.usernameInput = document.querySelector("input[type='text']");
      this.emailInput = document.querySelector("input[type='email']");
      this.passwordInput = document.querySelector("input[type='password']");
      this.dobSelect = document.querySelector("select");

      this.initialize();
    }

    initialize() {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent page reload

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

      if (username === "") {
        alert("Please enter your full name.");
        return false;
      }

      if (!this.isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return false;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
      }

      if (dob === "Select") {
        alert("Please choose your year of birth.");
        return false;
      }

      return true;
    }

    // Helper function for email validation
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

  const submitBtn = this.form.querySelector("button[type='submit']");
  if (submitBtn) submitBtn.disabled = true;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

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

    const data = await response.json(); // Most backends return JSON

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    alert(data.message || "🎉 Account created successfully!");
    this.form.reset();
    window.location.href = "index.html";

  } catch (error) {
    if (error.username === "AbortError") {
      alert("Request timed out. Please try again.");
    } else {
      console.error("Signup error:", error);
      alert(error.message || "Signup failed. Please try again.");
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
    }
    
  }

  // ---------------- CREATE INSTANCE ----------------
  new SignupForm();
});
