document.addEventListener('DOMContentLoaded', async () => {
    try {
        const user = await API.checkAuth();

        if (!user) {
            window.location.replace("/TAM/index.html");
            return;
        }

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

        console.log("Leaderboard API Response:", result);

        let leaderboardData;

        if (result && result.success && result.data) {
            leaderboardData = result.data;
        } else if (Array.isArray(result)) {
            leaderboardData = result;
        } else if (result && Array.isArray(result.leaderboard)) {
            leaderboardData = result.leaderboard;
        } else {
            throw new Error("Unexpected API response format");
        }

        if (!leaderboardData || leaderboardData.length === 0) {
            list.innerHTML = "<p>No operatives found in the database.</p>";
            return;
        }

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        leaderboardData.forEach((user, index) => {
            const item = document.createElement("div");
            item.className = "rank-item";

            const crown = index === 0 ? "👑 " : "";
            const topClass = index < 3 ? `top-${index + 1}` : "";

            item.innerHTML = `
                <div class="rank-info">
                    <span class="rank-number ${topClass}">#${index + 1}</span>
                    <span class="user-name">${crown}${user.username || 'Anonymous'}</span>
                </div>
                <span class="user-score">${user.total_score || 0} <small>pts</small></span>
            `;
            fragment.appendChild(item);
        });

        list.innerHTML = "";
        list.appendChild(fragment);

    } catch (error) {
        console.error("Leaderboard Error Details:", error);

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
