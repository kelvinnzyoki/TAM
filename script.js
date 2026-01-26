document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://cctamcc.site/";


    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");
    const submitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null; // ✅ Get the submit button

    if (loginBtn) loginBtn.onclick = () => loginModal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => loginModal.style.display = "none";
    
    window.onclick = (e) => { 
        if(e.target == loginModal) loginModal.style.display = "none"; 
    };

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }
    
    if (!submitBtn) {
        console.error("Submit button not found!");
        return;
    }
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        if (!email || !password) {
            alert("Email and password required");
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = "AUTHORIZING...";

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                submitBtn.innerText = "SUCCESS!";
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", data.user.username);
                
                // Short delay before redirect for better UX
                setTimeout(() => {
                    window.location.href = "index2.html";
                }, 500);
            } else {
                alert(data.message || "Login Failed");
                submitBtn.innerText = "AUTHORIZE";
                submitBtn.disabled = false;
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Server Offline or Connection Failed. Please try later.");
            submitBtn.innerText = "AUTHORIZE";
            submitBtn.disabled = false;
        }
    });
});
