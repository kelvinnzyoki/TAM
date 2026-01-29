async function loadDashboard() {
    const scoreDisplay = document.getElementById("totalScoreDisplay");

    try {
        // 1. Use API.request from auth.js
        // No need to pass email in the URL! The server gets your ID from the cookie.
        const data = await API.request("/total-score");

        // 2. Check for the score in the response
        // Note: In your server code, you returned { total_score: X }
        if (data && typeof data.total_score !== 'undefined') {
            animateValue(scoreDisplay, 0, data.total_score, 1000);
        } else {
            scoreDisplay.innerText = "0";
        }
    } catch (err) {
        console.error("Dashboard error:", err);
        // If API.request throws an error, it usually means the session is dead
        scoreDisplay.innerText = "Error";
    }
}

// Keep your cool animation function exactly as it is
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Update the logout to use the API helper
async function handleLogout() {
    try {
        await API.logout(); // Clears cookies on server and redirects to index.html
    } catch (err) {
        // Fallback if server is unreachable
        localStorage.clear();
        window.location.href = "index.html";
    }
}

window.onload = loadDashboard;
