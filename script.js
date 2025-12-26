const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closeBtn");

// Open modal with fade
loginBtn.onclick = function() {
    loginModal.style.display = "block";
    loginModal.style.opacity = "0";
    setTimeout(() => {
        loginModal.style.transition = "opacity 0.4s ease";
        loginModal.style.opacity = "1";
    }, 10);
}

// Close modal
closeBtn.onclick = function() {
    loginModal.style.display = "none";
}

// Close modal if clicking outside the box
window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
}

// Your existing Login Fetch Logic stays here
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    // ... your fetch code ...
});
