// Wait for page to load completely
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. GET ALL ELEMENTS (matching your HTML) ---
    const victoryTextarea = document.querySelector('.audit-card.victory textarea');
    const defeatTextarea = document.querySelector('.audit-card.defeat textarea');
    const focusRange = document.getElementById('focusRange');
    const egoRange = document.getElementById('egoRange');
    const chartCanvas = document.getElementById('performanceRadar');

    // Verify critical elements exist
    if (!victoryTextarea || !defeatTextarea) {
        console.error("❌ Textareas not found!");
        return;
    }

    // --- 2. INITIALIZE CHART ---
    let performanceChart = null;
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Discipline', 'Focus', 'Ego Control', 'Physical', 'Social'],
                datasets: [{
                    label: 'Alpha Profile',
                    data: [50, 50, 50, 50, 50], // Default values
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

    // --- 3. UPDATE CHART WHEN SLIDERS CHANGE ---
    if (focusRange && egoRange && performanceChart) {
        focusRange.addEventListener('input', () => {
            performanceChart.data.datasets[0].data[1] = parseInt(focusRange.value);
            performanceChart.update();
        });

        egoRange.addEventListener('input', () => {
            performanceChart.data.datasets[0].data[2] = parseInt(egoRange.value);
            performanceChart.update();
        });
    }

    // --- 4. LOAD AUDIT DATA FROM SERVER ---
    async function loadAudit() {
        try {
            const data = await API.request("/api/audit/load");
            
            // Populate textareas
            victoryTextarea.value = data.victory || "";
            defeatTextarea.value = data.defeat || "";

            // Update chart if server returns metrics
            if (performanceChart) {
                if (data.focus !== undefined) {
                    focusRange.value = data.focus;
                    performanceChart.data.datasets[0].data[1] = data.focus;
                }
                if (data.ego_control !== undefined) {
                    egoRange.value = data.ego_control;
                    performanceChart.data.datasets[0].data[2] = data.ego_control;
                }
                performanceChart.update();
            }

            console.log("✅ Audit loaded successfully");
        } catch (err) {
            console.error("❌ Load failed:", err);
            // Don't show alert on load failure - let user start fresh
        }
    }

    // Load existing data
    await loadAudit();

    console.log("✅ Mental audit page initialized");
});

// --- 5. GLOBAL SAVE FUNCTION (called by onclick in HTML) ---
async function saveAudit() {
    const victoryTextarea = document.querySelector('.audit-card.victory textarea');
    const defeatTextarea = document.querySelector('.audit-card.defeat textarea');
    const focusRange = document.getElementById('focusRange');
    const egoRange = document.getElementById('egoRange');

    if (!victoryTextarea || !defeatTextarea) {
        showToast("Error: Page elements not found");
        return;
    }

    const victory = victoryTextarea.value.trim();
    const defeat = defeatTextarea.value.trim();
    const focus = focusRange ? parseInt(focusRange.value) : 50;
    const egoControl = egoRange ? parseInt(egoRange.value) : 50;

    // Show loading state
    const btn = event.target;
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Syncing...";

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

        if (data.success) {
            showToast("✅ Audit Sealed Successfully");
        } else {
            showToast("Failed to save: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        console.error("❌ Save failed:", err);
        showToast("Connection Error. Please try again.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
        }
