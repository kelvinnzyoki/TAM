// --- 1. CHART INITIALIZATION ---
const ctx = document.getElementById('performanceRadar').getContext('2d');
let performanceChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Discipline', 'Focus', 'Ego Control', 'Physical', 'Social'],
        datasets: [{
            label: 'Alpha Profile',
            data: [0, 0, 0, 0, 0], // Start at zero, update after load
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
                pointLabels: { color: '#888', font: { family: 'Orbitron', size: 10 } },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { display: false }
            }
        },
        plugins: { legend: { display: false } }
    }
});

// --- 2. PRODUCTION API CONFIG ---

// SAVE: Send data to the server
document.querySelector("#saveAudit").onclick = async () => {
  const victory = document.getElementById("victoryInput").value;
  const defeat = document.getElementById("defeatInput").value;
  const btn = document.querySelector("#saveAudit");

  btn.disabled = true;
  btn.innerText = "Syncing...";

  try {
    // CORRECTED PATH: Use /save to send data
    const data = await API.request("/api/audit/save", {
      method: "POST",
      body: JSON.stringify({ victory, defeat })
    });

    if (data.success) {
      alert("✅ Audit Synchronized");
    }
  } catch (err) {
    console.error("Save failed:", err);
    alert("Connection Error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Save Audit";
  }
};

// LOAD: Fetch data from server on page load
async function loadAudit() {
  try {
    // CORRECTED PATH: Use /load to fetch data
    const data = await API.request("/api/audit/load");
    
    document.getElementById("victoryInput").value = data.victory || "";
    document.getElementById("defeatInput").value = data.defeat || "";

    // OPTIONAL: If your server sends biometrics, update the chart here
     performanceChart.data.datasets[0].data = [data.discipline, data.focus...];
     performanceChart.update();

  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Initialize on load
window.onload = loadAudit;
