const recordBtn = document.getElementById('recordBtn');
const scoreInputs = document.querySelectorAll('input[name="scoreGroup"]');

// Handle button enabling when a score is picked
scoreInputs.forEach(input => {
    input.addEventListener("change", () => {
        recordBtn.disabled = false;
    });
});

recordBtn.addEventListener('click', async function() {
    // 1. Automatically grab the email from the browser bridge
    const email = localStorage.getItem("userEmail");

    if (!email) {
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    // 2. Get the score from the selected radio button
    const selectedInput = document.querySelector('input[name="scoreGroup"]:checked');
    const score = parseInt(selectedInput.getAttribute("data-score"));

    const dataToRecord = {
        email: email, // This is the email used to log in
        date: new Date().toISOString(),
        score: score
    };

    try {
        const response = await fetch("https://mybackend-production-b618.up.railway.app/record-score", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToRecord),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Score recorded for " + email);
            window.location.href = 'index2.html'; 
        } else {
            alert(data.error || "Failed to record");
        }
    } catch (error) {
        alert('Server error. Please try again.');
    }
});
