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

// Calculate discipline level based on all four metrics
function calculateDiscipline(social, focus, egoControl, physical) {
    // Weighted average calculation
    // You can adjust these weights based on importance
    const weights = {
        social: 0.25,      // 25%
        focus: 0.25,       // 25%
        egoControl: 0.25,  // 25%
        physical: 0.25     // 25%
    };
    
    const weightedSum = 
        (social * weights.social) +
        (focus * weights.focus) +
        (egoControl * weights.egoControl) +
        (physical * weights.physical);
    
    // Map from 0-100 range to 40-60 range for discipline
    const minDiscipline = 0;
    const maxDiscipline = 100;
    const disciplineRange = maxDiscipline - minDiscipline;
    
    // Scale the weighted average to the 40-60 range
    const disciplineLevel = minDiscipline + (weightedSum / 100) * disciplineRange;
    
    return Math.round(disciplineLevel);
}

document.addEventListener('DOMContentLoaded', async () => {
    const victoryTextarea = document.querySelector('.audit-card.victory textarea');
    const defeatTextarea = document.querySelector('.audit-card.defeat textarea');
    
    const focusRange = document.getElementById('focusRange');
    const egoRange = document.getElementById('egoRange');
    const socialRange = document.getElementById('socialRange');
    const physicalRange = document.getElementById('physicalRange');
    
    const focusValueDisplay = document.getElementById('focusValue');
    const egoValueDisplay = document.getElementById('egoValue');
    const socialValueDisplay = document.getElementById('socialValue');
    const physicalValueDisplay = document.getElementById('physicalValue');
    const disciplineValueDisplay = document.getElementById('disciplineValue');
    
    const chartCanvas = document.getElementById('performanceRadar');
    const saveBtn = document.querySelector('.record-btn');

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
                labels: ['Discipline', 'Social', 'Focus', 'Ego Control', 'Physical'],
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

    // Function to update all values and recalculate discipline
    function updateAllMetrics() {
        const socialValue = parseInt(socialRange.value);
        const focusValue = parseInt(focusRange.value);
        const egoValue = parseInt(egoRange.value);
        const physicalValue = parseInt(physicalRange.value);
        
        // Calculate discipline based on all four metrics
        const disciplineValue = calculateDiscipline(socialValue, focusValue, egoValue, physicalValue);
        
        // Update display values
        socialValueDisplay.textContent = socialValue;
        focusValueDisplay.textContent = focusValue;
        egoValueDisplay.textContent = egoValue;
        physicalValueDisplay.textContent = physicalValue;
        disciplineValueDisplay.textContent = disciplineValue;
        
        // Update chart
        if (performanceChart) {
            performanceChart.data.datasets[0].data = [
                disciplineValue,  // Index 0: Discipline
                socialValue,      // Index 1: Social
                focusValue,       // Index 2: Focus
                egoValue,         // Index 3: Ego Control
                physicalValue     // Index 4: Physical
            ];
            performanceChart.update('none');
        }
        
        console.log("📊 Metrics updated:", { social: socialValue, focus: focusValue, ego: egoValue, physical: physicalValue, discipline: disciplineValue });
    }

    // Debounced chart updates
    const updateChartDebounced = debounce(updateAllMetrics, 150);

    // Add event listeners to all range inputs
    if (socialRange) {
        socialRange.addEventListener('input', updateChartDebounced);
    }
    
    if (focusRange) {
        focusRange.addEventListener('input', updateChartDebounced);
    }

    if (egoRange) {
        egoRange.addEventListener('input', updateChartDebounced);
    }
    
    if (physicalRange) {
        physicalRange.addEventListener('input', updateChartDebounced);
    }

    // Load audit data
    async function loadAudit() {
        try {
            const data = await API.request("/api/audit/load");

            victoryTextarea.value = data.victory || "";
            defeatTextarea.value = data.defeat || "";

            if (performanceChart) {
                if (data.social !== undefined) {
                    socialRange.value = data.social;
                }
                if (data.focus !== undefined) {
                    focusRange.value = data.focus;
                }
                if (data.ego_control !== undefined) {
                    egoRange.value = data.ego_control;
                }
                if (data.physical !== undefined) {
                    physicalRange.value = data.physical;
                }
                
                // Update all metrics after loading
                updateAllMetrics();
            }

            console.log("✅ Audit loaded successfully");
        } catch (err) {
            console.error("❌ Load failed:", err);
        }
    }

    await loadAudit();

    // Save button listener
    saveBtn.addEventListener('click', async function(event) {
        // Prevent double-clicks
        if (saveBtn.disabled && saveBtn.innerText === "Syncing...") return;

        const victory = victoryTextarea.value.trim();
        const defeat = defeatTextarea.value.trim();
        const social = socialRange ? parseInt(socialRange.value) : 50;
        const focus = focusRange ? parseInt(focusRange.value) : 50;
        const egoControl = egoRange ? parseInt(egoRange.value) : 50;
        const physical = physicalRange ? parseInt(physicalRange.value) : 50;
        const discipline = calculateDiscipline(social, focus, egoControl, physical);

        console.log("📤 Saving audit data:", { victory, defeat, social, focus, egoControl, physical, discipline });

        const originalText = saveBtn.innerText;
        saveBtn.disabled = true;
        saveBtn.innerText = "Syncing...";

        try {
            const data = await API.request("/api/audit/save", {
                method: "POST",
                body: JSON.stringify({
                    victory,
                    defeat,
                    social,
                    focus,
                    ego_control: egoControl,
                    physical,
                    discipline
                })
            });

            console.log("📥 Server response:", data);

            if (data.success) {
                showToast("🔥 Audit Sealed Successfully");
                
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

    console.log("✅ Mental audit page initialized with all metrics");
});
