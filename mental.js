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

document.addEventListener('DOMContentLoaded', async () => {
    const victoryTextarea = document.querySelector('.audit-card.victory textarea');
    const defeatTextarea = document.querySelector('.audit-card.defeat textarea');
    const focusRange = document.getElementById('focusRange');
    const egoRange = document.getElementById('egoRange');
    const chartCanvas = document.getElementById('performanceRadar');
    const saveBtn = document.querySelector('.record-btn'); // ← ADD THIS

    if (!victoryTextarea || !defeatTextarea) {
        console.error("❌ Textareas not found!");
        return;
    }

    if (!saveBtn) {
        console.error("❌ Save button not found!");
        return;
    }

    let performanceChart = null;

    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Discipline', 'Focus', 'Ego Control', 'Physical', 'Social'],
                datasets: [{
                    label: 'Alpha Profile',
                    data: [50, 50, 50, 50, 50],
                    backgroundColor: 'rgba(0, 199, 182, 0.2)',
                    borderColor: '#00c7b6',
                    pointBackgroundColor: '#00c7b6',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: '#333' },
                        grid: { color: '#333' },
                        pointLabels: {
                            color: '#00c7b6',
                            font: { family: 'Orbitron', size: 12 }
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            display: true,
                            color: '#666',
                            backdropColor: 'transparent'
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Debounced chart updates
    const updateChartDebounced = debounce(() => {
        if (performanceChart) {
            performanceChart.update('none');
        }
    }, 150);

    if (focusRange && egoRange && performanceChart) {
        focusRange.addEventListener('input', () => {
            const focusValue = parseInt(focusRange.value);
            console.log("📊 Focus changed to:", focusValue); // Debug log
            performanceChart.data.datasets[0].data[1] = focusValue;
            updateChartDebounced();
        });

        egoRange.addEventListener('input', () => {
            const egoValue = parseInt(egoRange.value);
            console.log("📊 Ego Control changed to:", egoValue); // Debug log
            performanceChart.data.datasets[0].data[2] = egoValue;
            updateChartDebounced();
        });
    }

    // Load audit data
    async function loadAudit() {
        try {
            const data = await API.request("/api/audit/load");

            victoryTextarea.value = data.victory || "";
            defeatTextarea.value = data.defeat || "";

            if (performanceChart) {
                if (data.focus !== undefined) {
                    focusRange.value = data.focus;
                    performanceChart.data.datasets[0].data[1] = data.focus;
                }
                if (data.ego_control !== undefined) {
                    egoRange.value = data.ego_control;
                    performanceChart.data.datasets[0].data[2] = data.ego_control;
                }
                performanceChart.update('none');
            }

            console.log("✅ Audit loaded successfully");
        } catch (err) {
            console.error("❌ Load failed:", err);
        }
    }

    await loadAudit();

    // ========================================
    // CRITICAL FIX: ATTACH SAVE BUTTON LISTENER
    // ========================================
    saveBtn.addEventListener('click', async function(event) {
        // Prevent double-clicks
        if (saveBtn.disabled && saveBtn.innerText === "Syncing...") return;

        const victory = victoryTextarea.value.trim();
        const defeat = defeatTextarea.value.trim();
        const focus = focusRange ? parseInt(focusRange.value) : 50;
        const egoControl = egoRange ? parseInt(egoRange.value) : 50;

        console.log("📤 Saving audit data:", { victory, defeat, focus, egoControl }); // Debug log

        const originalText = saveBtn.innerText;
        saveBtn.disabled = true;
        saveBtn.innerText = "Syncing...";

        try {
            const data = await API.request("/api/audit/save", {
                method: "POST",
                body: JSON.stringify({
                    victory,
                    defeat,
                    focus,
                    ego_control: egoControl
                })
            });

            console.log("📥 Server response:", data); // Debug log

            if (data.success) {
                showToast("🔥 Audit Sealed Successfully");
                
                // Optional: Navigate back after delay
                setTimeout(() => {
                    window.location.replace('index2.html');
                }, 1000);
            } else {
                showToast("Failed to save: " + (data.message || "Unknown error"));
                saveBtn.disabled = false;
                saveBtn.innerText = originalText;
            }
        } catch (err) {
            console.error("❌ Save failed:", err);
            showToast("Connection Error. Please try again.");
            saveBtn.disabled = false;
            saveBtn.innerText = originalText;
        }
    });

    console.log("✅ Mental audit page initialized with save listener attached");
});
