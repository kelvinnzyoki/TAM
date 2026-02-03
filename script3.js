document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const scoreInputs = document.querySelectorAll('input[name="scoreGroup"]');

    if (!recordBtn) {
        console.error("❌ Record button not found! Check your HTML.");
        return;
    }

    if (scoreInputs.length === 0) {
        console.error("❌ No score inputs found! Check your HTML.");
        return;
    }

    let currentScore = 0;

    scoreInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.checked) {
                currentScore = parseInt(input.getAttribute("data-score")) || 0;
                recordBtn.disabled = false;
                console.log("✅ Score selected:", currentScore);
            }
        });
    });

    recordBtn.addEventListener('click', async function() {
    if (recordBtn.disabled && recordBtn.innerText === "Saving...") return;

    recordBtn.disabled = true;
    recordBtn.innerText = "Saving...";

    try {
        const data = await API.request("/addictions", { // or /pushups, etc.
            method: 'POST',
            body: JSON.stringify({
                score: Number(currentScore),
                date: new Date().toISOString().split('T')[0]
            })
        });

        if (data.success) {
            showToast("✅ Alpha Progress Recorded");
            
            // --- EXPERT FIX START ---
            // Reset the UI so the user knows they can record again
            recordBtn.innerText = "Record & Go!";
            recordBtn.disabled = false;
            
            // Clear selections (optional but recommended)
            scoreInputs.forEach(input => input.checked = false);
            // --- EXPERT FIX END ---
            
        } else {
            showToast(data.message || "Failed to record", "error");
        }
    } catch (error) {
        console.error("❌ Submission error:", error);
        showToast('Server error. Please try again.', 'error');
    } finally {
        // This ensures the button is ALWAYS clickable again if something goes wrong
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
