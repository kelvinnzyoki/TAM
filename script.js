// Elements
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeBtn = document.getElementById("closeBtn");
const submitLogin = document.getElementById("submitLogin");

document.getElementById("signupBtn").addEventListener("click", function() {
    window.location.href = "index1.html"; // redirect to the sign-up page
});

// Open modal
loginBtn.onclick = () => {
    loginModal.style.display = "flex";
};

// Close modal
closeBtn.onclick = () => {
    loginModal.style.display = "none";
};

// Close when clicking outside modal box
window.onclick = (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
};

// Validate login
submitLogin.onclick = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


fetch("mybackend-production-b618.up.railway.applogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.username) {
            alert("Login successful! Welcome " + data.username);
            // Example: redirect to your main workout page
            window.location.href = "index2.html";
        } else {
            alert(data.message);
        }
    });
});


