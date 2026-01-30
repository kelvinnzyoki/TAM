async function fetchLeaderboard() {
    const list = document.getElementById("leaderboardList");

    try {
        // Use API.request to stay consistent with your other pages
        const result = await API.request("/leaderboard");

        if (result.success) {
            list.innerHTML = ""; // Clear loading state
            
            result.data.forEach((user, index) => {
                const item = document.createElement("div");
                item.className = "rank-item";
                
                // Add a special class for the top 3 performers
                const crown = index === 0 ? "👑 " : "";
                const topClass = index < 3 ? `top-${index + 1}` : "";

                item.innerHTML = `
                    <span class="rank-number ${topClass}">#${index + 1}</span>
                    <span class="user-name">${crown}${user.username}</span>
                    <span class="user-score">${user.total_score} pts</span>
                `;
                list.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Leaderboard Error:", error);
        list.innerHTML = "<p style='color: #ff4444;'>Failed to load Alpha rankings</p>";
    }
}

window.onload = fetchLeaderboard;
