const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closeBtn");
const loginForm = document.getElementById("loginForm");

// Modal Toggle
loginBtn.onclick = () => loginModal.style.display = "block";
closeBtn.onclick = () => loginModal.style.display = "none";
window.onclick = (e) => { if(e.target == loginModal) loginModal.style.display = "none"; }

// Login Logic
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const submitBtn = document.getElementById("submitLogin");

    submitBtn.innerText = "AUTHORIZING...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://mybackend-production-b618.up.railway.app/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // CRITICAL: Save email for the dashboard to use
            localStorage.setItem("userEmail", email);
            window.location.href = "index2.html"; 
        } else {
            alert(data.message || "Login Failed");
            submitBtn.innerText = "AUTHORIZE";
            submitBtn.disabled = false;
        }
    } catch (err) {
        alert("Server Offline");
        submitBtn.disabled = false;
    }
});
