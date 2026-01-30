document.addEventListener('DOMContentLoaded', () => {
    loadArena();
});

// 1. Render the feed with victories
function renderFeed(feedData) {
    const container = document.getElementById('activityFeed');
    
    if (!feedData || feedData.length === 0) {
        container.innerHTML = "<p style='text-align:center; color: #666;'>No victories yet today. Be the first.</p>";
        return;
    }

    container.innerHTML = feedData.map(item => {
        const timeAgo = getTimeAgo(item.updated_at);
        const rank = getRank(item.total_score);
        
        return `
            <div class="card">
                <div class="avatar">${item.username.charAt(0).toUpperCase()}</div>
                <div class="card-content">
                    <h4>${item.username} <span class="badge ${rank.toLowerCase()}">${rank}</span></h4>
                    <p class="victory-text">"${item.victory}"</p>
                    <p class="meta-text">${item.total_score} pts • ${timeAgo}</p>
                </div>
            </div>
        `;
    }).join('');
}

// 2. Helper to determine Rank based on score
function getRank(score) {
    if (score > 100) return "LEGEND";
    if (score > 50) return "WARRIOR";
    return "NOVICE";
}

// 3. Helper to format time
function getTimeAgo(timestamp) {
    if (!timestamp) return "Just now";
    
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

// 4. Fetch feed data
async function loadArena() {
    try {
        const data = await API.request("/feed");
        
        if (data.success) {
            renderFeed(data.data);
            console.log("✅ Arena feed loaded");
        } else {
            console.error("Feed load failed:", data.message);
        }
    } catch (err) {
        console.error("❌ Arena load error:", err);
        const container = document.getElementById('activityFeed');
        container.innerHTML = "<p style='color: #ff4d4d;'>Failed to load feed. Please refresh.</p>";
    }
}

// 5. Post a victory
async function postAchievement() {
    const userAction = prompt("Declare your victory (e.g., '100 Pushups', 'Meditated 20 mins'):");
    
    if (!userAction || userAction.trim() === "") {
        return;
    }

    try {
        const response = await API.request("/api/audit/save", {
            method: "POST",
            body: JSON.stringify({
                victory: userAction.trim(),
                defeat: ""
            })
        });

        if (response.success) {
            alert("✅ Victory Broadcasted!");
            await loadArena(); // Refresh the feed
        } else {
            alert("Failed: " + (response.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Post error:", err);
        alert("Failed to post victory. Please try again.");
    }
}

// Make postAchievement available globally for HTML onclick
window.postAchievement = postAchievement;
