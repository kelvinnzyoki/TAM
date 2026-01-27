// Initialize Chart.js Radar
const ctx = document.getElementById('performanceRadar').getContext('2d');
let performanceChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Discipline', 'Focus', 'Ego Control', 'Physical', 'Social'],
        datasets: [{
            label: 'Alpha Profile',
            data: [80, 70, 60, 90, 50], // Initial dummy data
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

function saveAudit() {
    const focusVal = document.getElementById('focusRange').value;
    const egoVal = document.getElementById('egoRange').value;

    // Logic to save values to localStorage
    const auditData = {
        date: new Date().toLocaleDateString(),
        focus: focusVal,
        ego: egoVal,
        victory: document.querySelector('.victory textarea').value,
        defeat: document.querySelector('.defeat textarea').value
    };

    localStorage.setItem('lastAudit', JSON.stringify(auditData));
    
    // Animation feedback
    const btn = document.querySelector('.record-btn');
    btn.innerHTML = "AUDIT SEALED";
    btn.style.background = "#00ff88";
    
    setTimeout(() => {
        location.href = 'index2.html';
    }, 1500);
}




// save
document.addEventListener('DOMContentLoaded', () => {
    const victText = document.querySelector('.victory textarea');
    const defText = document.querySelector('.defeat textarea');

    // Load existing data from the session
    const savedAudit = SessionManager.getData('stoic_audit');
    if (savedAudit) {
        victText.value = savedAudit.victory || "";
        defText.value = savedAudit.defeat || "";
    }

    // "Live Sync" - Save every time they stop typing (500ms delay)
    let timeout = null;
    const autoSave = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            SessionManager.saveData('stoic_audit', {
                victory: victText.value,
                defeat: defText.value
            });
            console.log("Audit Synced to Session.");
        }, 500);
    };

    victText.addEventListener('input', autoSave);
    defText.addEventListener('input', autoSave);
});
