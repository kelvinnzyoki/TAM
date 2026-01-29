const recordBtn = document.getElementById('recordBtn');
const scoreInputs = document.querySelectorAll('input[name="scoreGroup"]');

// Handle button enabling when a score is picked
scoreInputs.forEach(input => {
    input.addEventListener("change", () => {
        recordBtn.disabled = false;
    });
});

recordBtn.addEventListener('click', async function() {
    const selectedInput = document.querySelector('input[name="scoreGroup"]:checked');
    
    if (!selectedInput) return; // Guard clause

    const score = parseInt(selectedInput.getAttribute("data-score"));
    currentScore = parseInt(box.getAttribute("data-score"));

    // We use API.request which handles:
    // 1. Sending the HttpOnly Cookie automatically
    // 2. Refreshing the token if it's expired (401)
    // 3. Retrying the request after refresh
    try {
        const data = await API.request("/addictions", {
            method: 'POST',
            body: JSON.stringify({
                score: currentScore,
                date: new Date().toISOString()
            })
        });

        // Since API.request returns res.json(), we check for success data
        if (data.success) {
            alert("✅ Alpha Progress Recorded");
            window.location.href = 'index2.html'; 
        } else {
            alert(data.message || "Failed to record");
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert('Authentication failed or server error.');
    }
});
