// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");
    const submitLogin = document.getElementById("submitLogin");
    const signupBtn = document.getElementById("signupBtn");

    // Signup button
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "index1.html";
        });
    }

    // Open modal
    if (loginBtn) {
        loginBtn.onclick = () => {
            loginModal.style.display = "flex";
        };
    }

    // Close modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            loginModal.style.display = "none";
        };
    }

    // Close when clicking outside
    window.onclick = (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
    };

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Stop page refresh

            // Get form values
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Show loading state
            submitLogin.disabled = true;
            submitLogin.innerText = "Processing...";

            try {
                const response = await fetch("https://mybackend-production-b618.up.railway.app/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    alert("Login successful, {data.user.username}!");
                    window.location.href = "index2.html";
                } else {
                    alert(data.message || "Login failed");
                }

            } catch (error) {
                console.error("Login error:", error);
                alert("Server error. Please try again.");
            } finally {
                // Re-enable button (only runs if redirect didn't happen)
                submitLogin.disabled = false;
                submitLogin.innerText = "Login";
            }
        });
    }

});
