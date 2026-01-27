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
const API_BASE = "https://cctamcc.site/api"; // Unified Base URL

// 3. LOAD STATE FROM POSTGRESQL
window.addEventListener('load', async () => {
    const token = sessionStorage.getItem('auth_token'); // Ensure key name matches Login
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE}/audit/load`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Match these keys to your PostgreSQL column names
        
            if (data.victory) document.querySelector('.victory textarea').value = data.victory;
            if (data.defeat) document.querySelector('.defeat textarea').value = data.defeat;
        }
    } catch (err) {
        console.error("Failed to load initial state.");
    }
});

// 4. DEBOUNCED AUTO-SAVE
let debouncer;
document.querySelectorAll('textarea').forEach(el => {
    el.addEventListener('input', () => {
        clearTimeout(debouncer);
        debouncer = setTimeout(async () => {
            const token = sessionStorage.getItem('auth_token');
            const payload = {
                victory: document.querySelector('.victory textarea').value,
                defeat: document.querySelector('.defeat textarea').value
            };

            try {
                const response = await fetch(`${API_BASE}/audit/save`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) console.log("PostgreSQL Synced.");
            } catch (error) {
                console.error("Sync Error: Connection lost.");
            }
        }, 1500); 
    });
});
