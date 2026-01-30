const recordBtn = document.getElementById('recordBtn');
const scoreInputs = document.querySelectorAll('input[name="scoreGroup"]');

let currentScore = 0; // ✅ Store the score globally

// Handle radio button selection
scoreInputs.forEach(input => {
    input.addEventListener("change", () => {
        if (input.checked) {
            // Get the score from the selected radio button
            currentScore = parseInt(input.getAttribute("data-score"));
            recordBtn.disabled = false;
        }
    });
});

// Submit the score
recordBtn.addEventListener('click', async function() {
    const selectedInput = document.querySelector('input[name="scoreGroup"]:checked');
    
    if (!selectedInput) {
        alert("Please select a score first");
        return;
    }

    // Disable button to prevent double-clicks
    recordBtn.disabled = true;
    recordBtn.innerText = "Saving...";

    try {
        const data = await API.request("/addictions", {
            method: 'POST',
            body: JSON.stringify({
                score: Number(currentScore),
                date: new Date().toISOString().split('T')[0] // ✅ Use YYYY-MM-DD format
            })
        });

        if (data.success) {
            alert("✅ Alpha Progress Recorded");
            window.location.href = '/TAM/index2.html'; // ✅ Fixed path
        } else {
            alert(data.message || "Failed to record");
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert('Server error. Please try again.');
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
