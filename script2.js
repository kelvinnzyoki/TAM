// Select all buttons
const buttons = document.querySelectorAll(".menu-btn");

// Add click event to each button
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const page = btn.getAttribute("data-target");
        window.location.href = page; // navigate to that page
    });
});

async function loadTotalScore() {
    const email = localStorage.getItem("userEmail");
    const display = document.getElementById("totalScoreDisplay");

    if (!email) {
        display.innerText = "Login to see score";
        return;
    }

    try {
        const response = await fetch(`https://mybackend-production-b618.up.railway.app/total-score/${email}`);
        const data = await response.json();

        if (data.success) {
            display.innerText = data.total_score;
        } else {
            console.error("Server said:", data.error);
            display.innerText = "Error";
        }
    } catch (err) {
        display.innerText = "Offline";
    }
}
