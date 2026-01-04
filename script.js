document.addEventListener("DOMContentLoaded", () => {
    const SERVER_URL = "https://mybackend-production-b618.up.railway.app";
    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeBtn = document.getElementById("closeBtn");
    const loginForm = document.getElementById("loginForm");

    if (loginBtn) loginBtn.onclick = () => loginModal.style.display = "block";
    if (closeBtn) closeBtn.onclick = () => loginModal.style.display = "none";
    
    window.onclick = (e) => { 
        if(e.target == loginModal) loginModal.style.display = "none"; 
    };

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const submitBtn = document.getElementById("submitLogin");

        submitBtn.innerText = "AUTHORIZING...";
        submitBtn.disabled = true;

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
