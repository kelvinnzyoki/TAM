const feedData = [
    { name: "S. Vercetti", action: "Completed 100 Push-ups", time: "Just now", rank: "WARRIOR" },
    { name: "M. Aurelius", action: "7 Day Sobriety Streak", time: "2m ago", rank: "LEGEND" },
    { name: "K. Ohara", action: "Finished Stoic Audit", time: "5m ago", rank: "NOVICE" }
];

function renderFeed() {
    const container = document.getElementById('activityFeed');
    container.innerHTML = feedData.map(item => `
        <div class="card">
            <div class="avatar">${item.name.charAt(0)}</div>
            <div class="card-content">
                <h4>${item.name} <span class="badge">${item.rank}</span></h4>
                <p>${item.action} • ${item.time}</p>
            </div>
        </div>
    `).join('');
}

function postAchievement() {
    const userAction = prompt("What did you conquer today?");
    if (userAction) {
        feedData.unshift({
            name: "YOU",
            action: userAction,
            time: "Just now",
            rank: "WARRIOR"
        });
        renderFeed();
    }
}

// Initial render
renderFeed();



// arena.js
function postAchievement() {
    const userAction = prompt("Declare your victory:");
    if (userAction) {
        const newPost = {
            name: "YOU",
            action: userAction,
            time: "Just now",
            rank: "WARRIOR"
        };
        
        // Add to local list and save to session
        let currentFeed = SessionManager.getData('arena_posts') || [];
        currentFeed.unshift(newPost);
        SessionManager.saveData('arena_posts', currentFeed);
        
        renderFeed();
    }
}
