document.addEventListener('DOMContentLoaded', () => {
    // 1. Identify all elements
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // 2. Open Modal when Header Logout is clicked
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutModal.style.display = 'flex';
        });
    }

    // 3. Close Modal when Cancel is clicked
    if (cancelLogout) {
        cancelLogout.onclick = () => {
            logoutModal.style.display = 'none';
        };
    }

    // 4. Handle Final Logout
    if (confirmLogout) {
        confirmLogout.onclick = async () => {
            try {
                // Change UI to show it's working
                confirmLogout.innerText = "TERMINATING...";
                confirmLogout.disabled = true;

                // Call your API
                await API.logout(); 
                
                // Redirect on success
                window.location.replace("/TAM/index.html");
            } catch (err) {
                console.error("Logout error:", err);
                // Fallback: Clear local data and force redirect
                localStorage.clear();
                window.location.replace("/TAM/index.html");
            }
        };
    }

    // Close modal if user clicks outside the modal box
    window.onclick = (event) => {
        if (event.target == logoutModal) {
            logoutModal.style.display = 'none';
        }
    };

    // Initialize the rest of the dashboard
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
