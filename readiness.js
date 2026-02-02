// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    const sleepInput = document.getElementById('sleepInput');
    const waterInput = document.getElementById('waterInput');
    const stressInput = document.getElementById('stressInput');
    const readinessScore = document.getElementById('readinessScore');
    const gaugeFill = document.getElementById('gauge-fill');
    const readinessStatus = document.getElementById('readinessStatus');

    if (!sleepInput || !waterInput || !stressInput) {
        console.error("❌ Required input elements not found!");
        return;
    }

    // Calculate readiness
    function calculateReadiness() {
        const sleep = parseFloat(sleepInput.value) || 0;
        const hydration = parseInt(waterInput.value) || 0;
        const stress = parseInt(stressInput.value) || 5;

        let sleepScore = (sleep / 8) * 40;
        if (sleepScore > 40) sleepScore = 40;

        let hydrationScore = hydration === 2 ? 30 : (hydration === 1 ? 15 : 0);
        let stressScore = (11 - stress) * 3;

        let total = Math.round(sleepScore + hydrationScore + stressScore);
        if (total > 100) total = 100;
        if (total < 0) total = 0;

        readinessScore.innerText = total;

        const dashValue = (total / 100) * 126;
        gaugeFill.style.strokeDasharray = `${dashValue}, 126`;

        if (total > 80) {
            gaugeFill.style.stroke = "#00ff88";
            readinessStatus.innerText = "PRIME STATUS: GO HARD";
            readinessStatus.style.color = "#00ff88";
        } else if (total > 50) {
            gaugeFill.style.stroke = "#00c7b6";
            readinessStatus.innerText = "FUNCTIONAL: PROCEED";
            readinessStatus.style.color = "#00c7b6";
        } else {
            gaugeFill.style.stroke = "#ff4d4d";
            readinessStatus.innerText = "CRITICAL: RECOVERY ONLY";
            readinessStatus.style.color = "#ff4d4d";
        }
    }

    // Debounced version for input events
    const debouncedCalculate = debounce(calculateReadiness, 150);

    sleepInput.addEventListener('input', debouncedCalculate);
    waterInput.addEventListener('change', calculateReadiness);
    stressInput.addEventListener('input', debouncedCalculate);

    // Load data from server
    async function loadRecoveryData() {
        try {
            const data = await API.request("/api/user/recovery");
            if (data) {
                sleepInput.value = data.sleep || 0;
                waterInput.value = data.hydration || 0;
                stressInput.value = data.stress || 5;
                calculateReadiness();
                console.log("✅ Recovery data loaded");
            }
        } catch (err) {
            console.error("❌ Failed to load recovery data:", err);
            calculateReadiness();
        }
    }

    await loadRecoveryData();
    console.log("✅ Bio-Hub initialized successfully");
});

// Global save function
async function saveRecovery() {
    const sleepInput = document.getElementById('sleepInput');
    const waterInput = document.getElementById('waterInput');
    const stressInput = document.getElementById('stressInput');
    const readinessScore = document.getElementById('readinessScore');

    const sleep = parseFloat(sleepInput.value) || 0;
    const hydration = parseInt(waterInput.value) || 0;
    const stress = parseInt(stressInput.value) || 5;
    const score = parseInt(readinessScore.innerText) || 0;

    const btn = event.target;
    btn.disabled = true;
    btn.innerText = "Syncing...";

    try {
        const data = await API.request("/api/user/recovery", {
            method: "POST",
            body: JSON.stringify({ sleep, hydration, stress, score })
        });

        if (data.success) {
            if (typeof showToast === 'function') {
                showToast("Data saved on your screen", "success", false);
            }
        } else {
            showToast("Failed: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        console.error("❌ Save failed:", err);
        showToast("Failed to save recovery data");
    } finally {
        btn.disabled = false;
        btn.innerText = "Save State";
    }
}
