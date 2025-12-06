// SIGN UP PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
 


    class SignupForm {
        constructor() {
            this.form = document.querySelector("form");
            this.nameInput = document.querySelector("input[type='text']");
            this.emailInput = document.querySelector("input[type='email']");
            this.passwordInput = document.querySelector("input[type='password']");
            this.dobSelect = document.querySelector("select");

            this.initialize();
        }

        initialize() {
            this.form.addEventListener("submit", (e) => {
                e.preventDefault();  // prevent page reload

                if (this.validateForm()) {
                    this.submitForm();
                }
            });
        }

        // VALIDATION LOGIC
        validateForm() {
            const name = this.nameInput.value.trim();
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
        
        // SAVE USER + REDIRECT
        submitForm() {
          const userData = {
            fullName: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value.trim(),
            dob: this.dobSelect.value
            };
            localStorage.setItem("userData", JSON.stringify(userData));
            alert("🎉 Account created successfully!");
            window.location.href = "index.html";
  
  // Reset inputs after success
  this.form.reset();
        }
    }

    // CREATE INSTANCE
    new SignupForm();
});
