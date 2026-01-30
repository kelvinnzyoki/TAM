// Wait for the page to fully load before running any code
document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const scoreInputs = document.querySelectorAll('input[name="scoreGroup"]');

    // Verify elements exist
    if (!recordBtn) {
        console.error("❌ Record button not found! Check your HTML.");
        return;
    }

    if (scoreInputs.length === 0) {
        console.error("❌ No score inputs found! Check your HTML.");
        return;
    }

    let currentScore = 0;

    // Handle radio button selection
    scoreInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.checked) {
                currentScore = parseInt(input.getAttribute("data-score"));
                recordBtn.disabled = false;
                console.log("✅ Score selected:", currentScore); // Debug log
            }
        });
    });

    // Submit the score
    recordBtn.addEventListener('click', async function() {
        const selectedInput = document.querySelector('input[name="scoreGroup"]:checked');
        
        if (!selectedInput) {
            showToast("Please select a score first");
            return;
        }

        console.log("📤 Submitting score:", currentScore); // Debug log

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

            console.log("📥 Server response:", data); // Debug log

            if (data.success) {
                showToast("✅ Alpha Progress Recorded");
                window.location.replace("/TAM/index2.html");
            } else {
                alert(data.message || "Failed to record");
                recordBtn.disabled = false;
                recordBtn.innerText = "Record & Go!";
            }
        } catch (error) {
            console.error("❌ Submission error:", error);
            alert('Server error. Please try again.');
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    });

    console.log("✅ Addictions page initialized successfully");
});
