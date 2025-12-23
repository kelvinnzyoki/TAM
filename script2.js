// Select all buttons
const buttons = document.querySelectorAll(".menu-btn");

// Add click event to each button
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const page = btn.getAttribute("data-target");
        if (page) {
            window.location.href = page; // navigate to that page
        }
    });
});

// Load total score on page load
document.addEventListener("DOMContentLoaded", loadTotalScore);

async function loadTotalScore() {
    const email = localStorage.getItem("userEmail");
    const display = document.getElementById("totalScoreDisplay");

    // Ensure display element exists
    if (!display) {
        console.error("Element with ID 'totalScoreDisplay' not found");
        return;
    }

    // If user is not logged in
    if (!email) {
        display.innerText = "Login to see score";
        return;
    }

    try {
        const response = await fetch(
            `https://mybackend-production-b618.up.railway.app/total-score?email=${encodeURIComponent(email)}`
        );

        // Handle HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            display.innerText = data.total_score;
        } else {
            console.error("Server error:", data.error);
            display.innerText = "Error loading score";
        }
    } catch (err) {
        console.error("Fetch failed:", err);
        display.innerText = "Offline";
    }
}
