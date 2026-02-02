// Cache DOM elements
let feedContainer = null;

document.addEventListener('DOMContentLoaded', () => {
    feedContainer = document.getElementById('activityFeed');
    loadArena();
});

// Render feed with DocumentFragment for performance
function renderFeed(feedData) {
    if (!feedContainer) return;

    if (!feedData || feedData.length === 0) {
        feedContainer.innerHTML = "<p style='text-align:center; color: #666;'>No victories yet. Be the first.</p>";
        return;
    }

    const fragment = document.createDocumentFragment();

    feedData.forEach(item => {
        const timeAgo = getTimeAgo(item.created_at);
        const rank = getRank(item.total_score);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="avatar">${item.username.charAt(0).toUpperCase()}</div>
            <div class="card-content">
                <h4>${item.username} <span class="badge ${rank.toLowerCase()}">${rank}</span></h4>
                <p class="victory-text">${item.post_text}</p>
                <p class="meta-text">${item.total_score} pts • ${timeAgo}</p>
            </div>
        `;
        fragment.appendChild(card);
    });

    feedContainer.innerHTML = "";
    feedContainer.appendChild(fragment);
}

function getRank(score) {
    if (score > 100) return "LEGEND";
    if (score > 50) return "WARRIOR";
    return "NOVICE";
}

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

async function loadArena() {
    if (!feedContainer) {
        feedContainer = document.getElementById('activityFeed');
    }

    try {
        console.log("🔄 Loading arena feed...");
        const data = await API.request("/feed");

        console.log("📡 Feed response:", data);

        if (data && data.success) {
            console.log("✅ Feed data received:", data.data);
            renderFeed(data.data);
        } else {
            console.error("❌ Feed load failed:", data);
            feedContainer.innerHTML = "<p style='color: #ff4d4d;'>Failed to load feed</p>";
        }
    } catch (err) {
        console.error("❌ Arena load error:", err);
        feedContainer.innerHTML = "<p style='color: #ff4d4d;'>Failed to load feed. Please refresh.</p>";
    }
}

function postAchievement() {
    console.log("🎯 Opening victory modal");
    const modal = document.getElementById("victoryModal");
    const input = document.getElementById("victoryInput");

    if (modal && input) {
        modal.style.display = "flex";
        input.focus();
    } else {
        console.error("❌ Modal elements not found");
    }
}

function closeVictoryModal() {
    console.log("❌ Closing victory modal");
    const modal = document.getElementById("victoryModal");
    const input = document.getElementById("victoryInput");

    if (modal) {
        modal.style.display = "none";
    }
    if (input) {
        input.value = "";
    }
}

async function submitVictory() {
    const input = document.getElementById("victoryInput");

    if (!input) {
        console.error("❌ Input element not found");
        return;
    }

    const victoryText = input.value.trim();

    console.log("📤 Attempting to submit:", victoryText);

    if (!victoryText || victoryText === "") {
        if (typeof showToast === 'function') {
            showToast("⚠️ PLEASE ENTER A MESSAGE", "error", false);
        } else {
            showToast("Please enter a victory");
        }
        return;
    }

    try {
        console.log("🚀 Posting to /arena/post...");

        const response = await API.request("/arena/post", {
            method: "POST",
            body: JSON.stringify({
                victory_text: victoryText
            })
        });

        console.log("📥 Response received:", response);

        if (response && response.success) {
            console.log("✅ Victory posted successfully");
            closeVictoryModal();

            if (typeof showToast === 'function') {
                showToast("🔥 messagge sent successfully", "success", false);
            }

            console.log("🔄 Reloading arena feed...");
            await loadArena();
        } else {
            console.error("❌ Post failed:", response);
            if (typeof showToast === 'function') {
                showToast("❌ POST FAILED", "error", false);
            } else {
                showToast("Failed to post");
            }
        }
    } catch (err) {
        console.error("❌ Post error:", err);
        if (typeof showToast === 'function') {
            showToast("❌ CONNECTION FAILED", "error", false);
        } else {
            showToast("Connection failed");
        }
    }
}

window.postAchievement = postAchievement;
window.closeVictoryModal = closeVictoryModal;
window.submitVictory = submitVictory;

console.log("✅ Arena.js loaded successfully");
