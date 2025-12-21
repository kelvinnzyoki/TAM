// 1. Elements
const recordForm = document.getElementById("recordForm");
const recordBtn = document.getElementById("recordBtn");
const scoreInputs = document.querySelectorAll('input[name="scoreGroup"]');

// 2. Handle Button Enabling
// This makes the button clickable only after a score is picked
scoreInputs.forEach(input => {
    input.addEventListener("change", () => {
        recordBtn.disabled = false;
        console.log("Score selected:", input.getAttribute("data-score"));
    });
});

// 3. Handle Form Submission
recordForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevents the phone from refreshing the page

    // Get values from the form
    const email = document.getElementById("email").value.trim();
    const selectedInput = document.querySelector('input[name="scoreGroup"]:checked');
    
    if (!selectedInput) {
        alert("Please select a category first.");
        return;
    }

    const score = parseInt(selectedInput.getAttribute("data-score"));

    // Prepare data for PostgreSQL
    const dataToRecord = {
        email: email,
        date: new Date().toISOString(),
        score: score
    };

    // UI State: Disable button while sending
    recordBtn.disabled = true;
    recordBtn.innerText = "Saving...";

    try {
        // NOTE: Ensure your backend route is "/api/record" or "/record"
        const response = await fetch("https://mybackend-production-b618.up.railway.app/record", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToRecord),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Data saved to PostgreSQL!");
            window.location.href = 'index2.html'; 
        } else {
            alert("❌ Error: " + (data.error || data.message));
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server connection failed. Check your internet or Railway logs.');
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
