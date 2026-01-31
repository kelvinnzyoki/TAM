document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const confirmed = showToast("Are you sure you want to logout?");
            if (!confirmed) return;

            try {
                await API.logout();
            } catch (err) {
                console.error("Logout error:", err);
                localStorage.clear();
                window.location.replace("/TAM/index.html");
            }
        });
    }

    // Your existing dashboard code...
    loadDashboard();
});

async function loadDashboard() {
    const scoreDisplay = document.getElementById("totalScoreDisplay");

    try {
        const data = await API.request("/total-score");

        if (data && typeof data.total_score !== 'undefined') {
            animateValue(scoreDisplay, 0, data.total_score, 1000);
        } else {
            scoreDisplay.innerText = "0";
        }
    } catch (err) {
        console.error("Dashboard error:", err);
        scoreDisplay.innerText = "Error";
    }
}

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
