// 1. CHART INITIALIZATION
const ctx = document.getElementById('performanceRadar').getContext('2d');
let performanceChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Discipline', 'Focus', 'Ego Control', 'Physical', 'Social'],
        datasets: [{
            label: 'Alpha Profile',
            data: [80, 70, 60, 90, 50],
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
                ticks: { display: false, max: 100, min: 0 }
            }
        },
        plugins: { legend: { display: false } }
    }
});

// 2. PRODUCTION API CONFIG

document.querySelector("#saveAudit").onclick = async () => {
  const victory = victoryInput.value;
  const defeat = defeatInput.value;

  await API.request("/api/audit/load", {
    method: "POST",
    body: JSON.stringify({ victory, defeat })
  });

  alert("Audit Saved");
};



// Load Stoic Audit 

async function loadAudit() {
  const data = await API.request("/api/audit/save");
  victoryInput.value = data.victory || "";
  defeatInput.value = data.defeat || "";
}




