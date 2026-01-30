// Wait for page to load completely
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. VERIFY ELEMENTS EXIST ---
    const saveBtn = document.querySelector("#saveAudit");
    const victoryInput = document.getElementById("victoryInput");
    const defeatInput = document.getElementById("defeatInput");
    const chartCanvas = document.getElementById('performanceRadar');

    if (!saveBtn || !victoryInput || !defeatInput) {
        console.error("❌ Required elements not found!");
        return;
    }

    // --- 2. INITIALIZE CHART (Only if canvas exists) ---
    let performanceChart = null;
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Discipline', 'Focus', 'Ego Control', 'Physical', 'Social'],
                datasets: [{
                    label: 'Alpha Profile',
                    data: [0, 0, 0, 0, 0],
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
                            color: '#888', 
                            font: { family: 'Orbitron', size: 10 } 
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // --- 3. SAVE BUTTON HANDLER ---
    saveBtn.onclick = async () => {
        const victory = victoryInput.value;
        const defeat = defeatInput.value;

        saveBtn.disabled = true;
        saveBtn.innerText = "Syncing...";

        try {
            const data = await API.request("/api/audit/save", {
                method: "POST",
                body: JSON.stringify({ victory, defeat })
            });

            if (data.success) {
                alert("✅ Audit Synchronized");
            } else {
                alert("Failed to save: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Save failed:", err);
            alert("Connection Error");
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = "Save Audit";
        }
    };

    // --- 4. LOAD AUDIT DATA ---
    async function loadAudit() {
        try {
            const data = await API.request("/api/audit/load");
            
            victoryInput.value = data.victory || "";
            defeatInput.value = data.defeat || "";

            // Update chart if data contains biometrics (optional)
            if (performanceChart && data.discipline !== undefined) {
                performanceChart.data.datasets[0].data = [
                    data.discipline || 0,
                    data.focus || 0,
                    data.ego_control || 0,
                    data.physical || 0,
                    data.social || 0
                ];
                performanceChart.update();
            }

            console.log("✅ Audit loaded successfully");
        } catch (err) {
            console.error("Load failed:", err);
        }
    }

    // Load data on initialization
    await loadAudit();
});
