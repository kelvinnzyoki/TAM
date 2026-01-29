async function loadDashboard() {
    const email = localStorage.getItem("userEmail");
    const scoreDisplay = document.getElementById("totalScoreDisplay");

    if (!email) {
        window.location.href = "index.html"; // Send back to login if no email
        return;
    }

    try {
        // Use the query parameter endpoint we fixed
        const url = `https://cctamcc.site/total-score?email=${encodeURIComponent(email)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Animate the number counting up
            animateValue(scoreDisplay, 0, data.total_score, 1000);
        }
    } catch (err) {
        console.error("Dashboard error:", err);
        scoreDisplay.innerText = "!!";
    }
}

// Cool number animation function
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

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

window.onload = loadDashboard;
