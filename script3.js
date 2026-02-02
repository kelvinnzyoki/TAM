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
        const selectedInput = document.querySelector('input[name="scoreGroup"]:checked');

        if (!selectedInput) {
            showToast("Please select a score first");
            return;
        }

        console.log("📤 Submitting score:", currentScore);

        recordBtn.disabled = true;
        recordBtn.innerText = "Saving...";

        try {
            const data = await API.request("/addictions", {
                method: 'POST',
                body: JSON.stringify({
                    score: Number(currentScore),
                    date: new Date().toISOString().split('T')[0]
                })
            });

            console.log("📥 Server response:", data);

            if (data.success) {
                showToast("✅ Alpha Progress Recorded");
            } else {
                showToast(data.message || "Failed to record");
                recordBtn.disabled = false;
                recordBtn.innerText = "Record & Go!";
            }
        } catch (error) {
            console.error("❌ Submission error:", error);
            showToast('Server error. Please try again.');
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    });

    console.log("✅ Addictions page initialized successfully");
});
