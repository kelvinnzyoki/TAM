async function fetchLeaderboard() {
    const SERVER_URL = "https://cctamcc.site";
    const list = document.getElementById("leaderboardList");

    try {
        const response = await fetch('SERVER_URL');
        const result = await response.json();

        if (result.success) {
            list.innerHTML = ""; // Clear loading text
            
            result.data.forEach((user, index) => {
                const item = document.createElement("div");
                item.className = "rank-item";
                
                // Hide part of the email for privacy (e.g., k***@gmail.com)
                const maskedEmail = user.email.split('@')[0].substring(0, 3) + "***";

                item.innerHTML = `
                    <span class="rank-number">#${index + 1}</span>
                    <span class="user-email">${maskedEmail}</span>
                    <span class="user-score">${user.total_score}</span>
                `;
                list.appendChild(item);
            });
        }
    } catch (error) {
        list.innerHTML = "<p>Failed to load data</p>";
    }
}

window.onload = fetchLeaderboard;
