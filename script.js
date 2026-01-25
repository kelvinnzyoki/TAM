document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = process.env.BASE_URL;
    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");

    if (loginBtn) loginBtn.onclick = () => loginModal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => loginModal.style.display = "none";
    
    window.onclick = (e) => { 
        if(e.target == loginModal) loginModal.style.display = "none"; 
    };

   if (!loginForm) {
    console.error("Login form not found!");
    return;
   } 
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        if (!email || !password) {
            alert("Email and password required");
            submitBtn.innerText = "AUTHORIZE";
            submitBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", data.user.username);
                window.location.href = "index2.html"; 
            } else {
                alert(data.message || "Login Failed");
                submitBtn.innerText = "AUTHORIZE";
                submitBtn.disabled = false;
            }
        } catch (err) {
            alert("Server Offline. Please try later.");
            submitBtn.innerText = "AUTHORIZE";
            submitBtn.disabled = false;
        }
    });
});
