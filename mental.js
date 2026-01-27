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

// Function to sync Victories and Defeats to your Node Server
async function syncAuditToProduction() {
    const token = sessionStorage.getItem('auth_token');
    
    const auditData = {
        victory: document.querySelector('.victory textarea').value,
        defeat: document.querySelector('.defeat textarea').value
    };

    try {
        const response = await fetch('https://cctamcc.site/api/user/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(auditData)
        });

        if (response.ok) {
            console.log("Persistence Confirmed.");
        }
    } catch (error) {
        console.error("Communication Blackout: Server Unreachable.");
    }
}

// Attach listener to textareas
document.querySelectorAll('textarea').forEach(area => {
    area.addEventListener('blur', syncAuditToProduction);
});



// On Page Load: Retrieve the "just left it there" state
window.addEventListener('load', async () => {
    const response = await fetch('/api/audit/load', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    });
    const data = await response.json();
    document.querySelector('.victory textarea').value = data.victory_text;
    document.querySelector('.defeat textarea').value = data.defeat_text;
});

// Auto-Save: Sync to PostgreSQL when the user stops typing
let debouncer;
document.querySelectorAll('textarea').forEach(el => {
    el.addEventListener('input', () => {
        clearTimeout(debouncer);
        debouncer = setTimeout(async () => {
            await fetch('/api/audit/save', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    victory: document.querySelector('.victory textarea').value,
                    defeat: document.querySelector('.defeat textarea').value
                })
            });
            console.log("Cloud Persistence Confirmed.");
        }, 1500); // 1.5s delay to protect server resources
    });
});
