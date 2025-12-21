// You can expand behavior later. For now, this just listens.
const avoidCheck = document.getElementById("avoidCheck");
const relapseCheck = document.getElementById("relapseCheck");

avoidCheck.addEventListener("change", () => {
    console.log("Avoided ticked:", avoidCheck.checked);
});

relapseCheck.addEventListener("change", () => {
    console.log("Relapsed ticked:", relapseCheck.checked);
});


const recordBtn = document.getElementById('recordBtn');
const customBoxes = document.querySelectorAll('.custom-box');
let currentScore = null;

// --- A. Handle Box Selection ---
customBoxes.forEach(box => {
    box.addEventListener('click', function() {
        // 1. Visual selection
        customBoxes.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');

        // 2. FIXED: Find the input nearby to get the score
        const input = this.closest('.row').querySelector('input[type="checkbox"]');
        if (input) {
            currentScore = parseInt(input.getAttribute('data-score'));
            console.log('Score selected:', currentScore);
            recordBtn.disabled = false; // Enable button
        }
    });
});

// --- B. Handle the Record Button Click ---
recordBtn.addEventListener('click', async function() {
    const email = document.getElementById("userEmailConfirm").value;
    if (currentScore === null) {
        alert("Please select a box before recording.");
        return;
    }
    
    // FIXED: Get email from localStorage (Saved during Login)
    //const email = localStorage.getItem("userEmail");

    if (!email) {
        alert("User session not found. Please log in again.");
        window.location.href = "index2.html"; // Redirect to login if email is missing
        return;
    }

    const dataToRecord = {
        email: email,
        date: new Date().toISOString(), 
        score: currentScore 
    };

    try {
        // FIXED: Added '/api' to match the backend route
        const response = await fetch("https://mybackend-production-b618.up.railway.app/record", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToRecord),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Success:', data.message);
            window.location.href = 'index2.html'; 
        } else {
            alert(data.error || "Failed to record");
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server connection failed.');
    }
});



    
