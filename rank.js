document.addEventListener('DOMContentLoaded', async () => {
    // 1. PROTECTION LAYER: Check if user is authenticated
    // Assuming API.checkAuth() exists in your auth.js
    const user = await API.checkAuth(); 
    
    if (!user) {
        // If not logged in, redirect to login page immediately
        window.location.replace("/TAM/index.html");
        return;
    }

    // 2. LOAD LEADERBOARD if authenticated
    fetchLeaderboard();
});

async function fetchLeaderboard() {
    const list = document.getElementById("leaderboardList");

    try {
        // API.request handles the JWT header (Authorization: Bearer <token>)
        // inside your auth.js logic.
        const result = await API.request("/leaderboard");

        if (result && result.success) {
            list.innerHTML = ""; // Clear "Loading..." state
            
            result.data.forEach((user, index) => {
                const item = document.createElement("div");
                item.className = "rank-item";
                
                // Add special styling for top 3
                const crown = index === 0 ? "👑 " : "";
                const topClass = index < 3 ? `top-${index + 1}` : "";

                item.innerHTML = `
                    <div class="rank-info">
                        <span class="rank-number ${topClass}">#${index + 1}</span>
                        <span class="user-name">${crown}${user.username}</span>
                    </div>
                    <span class="user-score">${user.total_score} <small>pts</small></span>
                `;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = "<p>No operatives found in the database.</p>";
        }
    } catch (error) {
        console.error("Leaderboard Error:", error);
        // Handle 401 Unauthorized specifically
        if (error.message.includes("401")) {
             window.location.replace("/TAM/index.html");
        } else {
            list.innerHTML = "<p style='color: var(--danger);'>Access Denied: Connection Failure</p>";
        }
    }
}
