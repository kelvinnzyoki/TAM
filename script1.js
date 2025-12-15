// SIGN UP PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  const SERVER_URL =
    "https://mybackend-production-b618.up.railway.app/signup";

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
      const name = this.usernameInput.value.trim();
      const email = this.emailInput.value.trim();
      const password = this.passwordInput.value.trim();
      const dob = this.dobSelect.value;

      if (name === "") {
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

      try {
        const response = await fetch(SERVER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Server Response:", data);
        alert(data.message || "🎉 Account created successfully!");

        // Redirect after success
        window.location.href = "index.html";
      } catch (error) {
        console.error("Signup failed:", error);
        alert(`Error: ${error.message}. Please try again.`);
      } finally {
        this.form.reset();
      }
    }
  }

  // ---------------- CREATE INSTANCE ----------------
  new SignupForm();
});
