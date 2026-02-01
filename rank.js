document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check authentication
        const user = await API.checkAuth(); 
        
        if (!user) {
            window.location.replace("/TAM/index.html");
            return;
        }

        // Load leaderboard if authenticated
        await fetchLeaderboard();
    } catch (error) {
        console.error("Auth check failed:", error);
        window.location.replace("/TAM/index.html");
    }
});

async function fetchLeaderboard() {
    const list = document.getElementById("leaderboardList");

    try {
        const result = await API.request("/leaderboard");
        
        console.log("Leaderboard API Response:", result); // DEBUG: See actual structure

        // Handle different possible response formats
        let leaderboardData;
        
        if (result && result.success && result.data) {
            // Format 1: {success: true, data: [...]}
            leaderboardData = result.data;
        } else if (Array.isArray(result)) {
            // Format 2: Direct array [...]
            leaderboardData = result;
        } else if (result && Array.isArray(result.leaderboard)) {
            // Format 3: {leaderboard: [...]}
            leaderboardData = result.leaderboard;
        } else {
            throw new Error("Unexpected API response format");
        }

        // Check if we have data
        if (!leaderboardData || leaderboardData.length === 0) {
            list.innerHTML = "<p>No operatives found in the database.</p>";
            return;
        }

        // Clear loading state
        list.innerHTML = "";
        
        // Render leaderboard
        leaderboardData.forEach((user, index) => {
            const item = document.createElement("div");
            item.className = "rank-item";
            
            // Add special styling for top 3
            const crown = index === 0 ? "👑 " : "";
            const topClass = index < 3 ? `top-${index + 1}` : "";

            item.innerHTML = `
                <div class="rank-info">
                    <span class="rank-number ${topClass}">#${index + 1}</span>
                    <span class="user-name">${crown}${user.username || 'Anonymous'}</span>
                </div>
                <span class="user-score">${user.total_score || 0} <small>pts</small></span>
            `;
            list.appendChild(item);
        });

    } catch (error) {
        console.error("Leaderboard Error Details:", error);
        
        // Handle specific errors
        if (error.message && error.message.includes("401")) {
            window.location.replace("/TAM/index.html");
        } else if (error.message && error.message.includes("403")) {
            list.innerHTML = "<p style='color: #ff4d4d;'>Access Denied: Insufficient Permissions</p>";
        } else {
            list.innerHTML = `
                <p style='color: #ff4d4d;'>
                    Connection Failure<br>
                    <small style='opacity: 0.7;'>${error.message || 'Unknown error'}</small>
                </p>
            `;
        }
    }
}
