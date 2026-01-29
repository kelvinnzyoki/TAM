function calculateReadiness() {
    const sleep = parseFloat(document.getElementById('sleepInput').value) || 0;
    const hydration = parseInt(document.getElementById('waterInput').value);
    const stress = parseInt(document.getElementById('stressInput').value);

    // Alpha Logic Calculation
    // Sleep (40%), Hydration (30%), Stress (30%)
    let sleepScore = (sleep / 8) * 40;
    if (sleepScore > 40) sleepScore = 40; // Cap at 8 hours

    let hydrationScore = hydration === 2 ? 30 : (hydration === 1 ? 15 : 0);
    let stressScore = (11 - stress) * 3; // Lower stress = higher score

    let total = Math.round(sleepScore + hydrationScore + stressScore);
    if (total > 100) total = 100;
    if (total < 0) total = 0;

    // Update UI
    const scoreDisplay = document.getElementById('readinessScore');
    const fill = document.getElementById('gauge-fill');
    const status = document.getElementById('readinessStatus');

    scoreDisplay.innerText = total;

    // SVG Gauge Animation (Dasharray length is ~126)
    const dashValue = (total / 100) * 126;
    fill.style.strokeDasharray = `${dashValue}, 126`;

    // Dynamic Colors
    if (total > 80) {
        fill.style.stroke = "#00ff88"; // Success
        status.innerText = "PRIME STATUS: GO HARD";
        status.style.color = "#00ff88";
    } else if (total > 50) {
        fill.style.stroke = "#00c7b6"; // Normal
        status.innerText = "FUNCTIONAL: PROCEED";
        status.style.color = "#00c7b6";
    } else {
        fill.style.stroke = "#ff4d4d"; // Danger
        status.innerText = "CRITICAL: RECOVERY ONLY";
        status.style.color = "#ff4d4d";
    }
}


// Initial calculation
calculateReadiness();




document.querySelector("#saveRecovery").onclick = async () => {
  await API.request("/api/user/recovery", {
    method: "POST",
    body: JSON.stringify({
      sleep: +sleep.value,
      hydration: +hydration.value,
      stress: +stress.value,
      score: +score.value
    })
  });

  alert("Recovery Synced");
};



async function loadRecovery() {
  const data = await API.request("/api/user/recovery");
  console.log("Latest Recovery:", data);
}
