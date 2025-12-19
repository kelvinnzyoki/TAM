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

document.getElementById("submitLogin").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://mybackend-production-b618.up.railway.app/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.email) {
        alert("Login successful");
          window.location.href = "index2.html";
      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
});

