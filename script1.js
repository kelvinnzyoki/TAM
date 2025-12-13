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
    e.preventDefault();  // prevent page reload
    
    if (this.validateForm()) {
     this.submitForm();
    }
   });
  
  }
  
  // VALIDATION LOGIC
  
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
  
  // Helper function for email validation (assuming you had one)
  isValidEmail(email) {
   // Simple regex for demonstration
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // SAVE USER + REDIRECT

  // SAVE USER + REDIRECT: Use async/await for proper fetching
        async submitForm() {
            // 1. Collect all required data
            const userData = {
                username: this.usernameInput.value.trim(),
                email: this.emailInput.value.trim(),
                // Include password if your server needs it for hashing
                password: this.passwordInput.value.trim(), 
                dob: this.dobSelect.value
            };
            
            try {
                // 2. Send data to the server and AWAIT the response
                const response = await fetch(SERVER_URL, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    // 3. CORRECT BODY: JSON.stringify the collected userData object
                    body: JSON.stringify(userData) 
                });
                
                // Check if the response was successful (e.g., status 200-299)
                if (!response.ok) {
                    // Throw error if server returns non-success status
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();

                console.log("Server Response:", data);
                alert(data.message || "🎉 Account created successfully!");
                
                // 4. Redirect ONLY after success
                window.location.href = "index.html";

            } catch (error) {
                // Handle network errors or server response errors
                console.error("Signup failed:", error);
                alert(`Error: ${error.message}. Please try again.`);
            } finally {
                // Reset form inputs after attempt (successful or failed)
                this.form.reset(); 
            }
        }
    }

    // CREATE INSTANCE
    new SignupForm();
});
