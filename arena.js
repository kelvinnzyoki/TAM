
// 1. Render the feed based on data from the server
function renderFeed(feedData) {
    const container = document.getElementById('activityFeed');
    if (!feedData || feedData.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No victories yet today. Be the first.</p>";
        return;
    }

    container.innerHTML = feedData.map(item => `
        <div class="card">
            <div class="avatar">${item.username.charAt(0).toUpperCase()}</div>
            <div class="card-content">
                <h4>${item.username} <span class="badge">${getRank(item.total_score)}</span></h4>
                <p>Scored ${item.total_score} points today • Active</p>
            </div>
        </div>
    `).join('');
}

// 2. Helper to determine Rank based on score
function getRank(score) {
    if (score > 100) return "LEGEND";
    if (score > 50) return "WARRIOR";
    return "NOVICE";
}

// 3. Fetch real data using auth.js bridge
async function loadArena() {
    try {
        // Calls your GET /leaderboard route
        const data = await API.request("/leaderboard");
        if (data.success) {
            renderFeed(data.data);
        }
    } catch (err) {
        console.error("Arena load failed:", err);
    }
}

// 4. Post a victory (Compatibility fix)
async function postAchievement() {
    const userAction = prompt("Declare your victory (e.g., '100 Pushups'):");
    if (!userAction) return;

    try {
        // If you have a specific /audit/save or /victory route:
        const response = await API.request("/api/audit/save", {
            method: "POST",
            body: JSON.stringify({
                victory: userAction,
                defeat: "None"
            })
        });

        if (response.success) {
            alert("Victory broadcasted!");
            loadArena(); // Refresh the feed
        }
    } catch (err) {
        alert("Failed to post victory.");
    }
}

// Initial Load
window.onload = loadArena;
