document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://cctamcc.site";


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



    function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    
    }
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        
        if (!email || !password) {
            showToast("Email and password required");
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = "AUTHORIZING...";

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                submitBtn.innerText = "SUCCESS!";
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", data.user.username);
                
                
    // Wait 3 seconds, then hide and navigate
    setTimeout(() => { 
        toast.className = toast.className.replace("show", "");
        window.location.href="index2.html"; // Your smooth navigation
    }, 500);
            } else {
                showToast(data.message || "Login Failed");
                submitBtn.innerText = "AUTHORIZE";
                submitBtn.disabled = false;
            }
        } catch (err) {
            console.error("Login error:", err);
            showToast("Server Offline or Connection Failed. Please try later.");
            submitBtn.innerText = "AUTHORIZE";
            submitBtn.disabled = false;
        }
    });


    // Simple scroll effect for Navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(5, 5, 5, 0.95)';
        nav.style.padding = '15px 0';
    } else {
        
        nav.style.background = 'rgba(5, 5, 5, 0.8)';
        nav.style.padding = '20px 0';
    }
});

    
});






