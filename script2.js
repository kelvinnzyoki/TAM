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
    if (!email) return;

    try {
        const response = await fetch(`https://your-backend.railway.app/api/total-score/${email}`);
        const data = await response.json();

        if (data.success) {
            // Assuming you have an element with ID 'totalScoreDisplay'
            document.getElementById("totalScoreDisplay").innerText = `Total Score: ${data.total_score}`;
        }
    } catch (err) {
        console.error("Failed to load score:", err);
    }
}

// Call this when the page loads
window.onload = loadTotalScore;
