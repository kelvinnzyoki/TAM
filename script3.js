// You can expand behavior later. For now, this just listens.
const avoidCheck = document.getElementById("avoidCheck");
const relapseCheck = document.getElementById("relapseCheck");

avoidCheck.addEventListener("change", () => {
    console.log("Avoided ticked:", avoidCheck.checked);
});

relapseCheck.addEventListener("change", () => {
    console.log("Relapsed ticked:", relapseCheck.checked);
});


let currentScore = null; // Variable to store the selected score

const recordBtn = document.getElementById('recordBtn');
const customBoxes = document.querySelectorAll('.custom-box');

// --- A. Handle Box Selection and Hidden Score Assignment ---
customBoxes.forEach(box => {
    box.addEventListener('click', function() {
        // 1. Deselect all boxes (removes the checkmark visual)
        customBoxes.forEach(b => b.classList.remove('selected'));
        
        // 2. Select the clicked box
        this.classList.add('selected');

        // 3. Get the score from the checkbox INPUT that is INSIDE the parent <label>
        // Use 'closest' to find the parent 'row', then use 'querySelector' to find the input within it.
        //const input = this.closest('.row').querySelector('input[type="checkbox"]');
        //console.log('Score selected (User does not see this):', currentScore);
        
    
        
        // 4. Get the score from the HIDDEN data attribute and save it
        // The score is extracted from the 'data-score' attribute (e.g., "90" or "5")
        currentScore = parseInt(this.getAttribute('data-score'));
        console.log('Score selected (User does not see this):', currentScore);
        
        // 5. Enable the record button
        recordBtn.disabled = false;
    });
});

// --- B. Handle the Record Button Click ---
recordBtn.addEventListener('click', function() {
    if (currentScore === null) {
        alert("Please select a box before recording.");
        return;
    }
    
    const email = document.getElementById('email')?.value;

    if (!email) {
        alert("email not found. Please log in again.");
        return;
    }
    

    const dataToRecord = {
        email: email,
        date: new Date().toISOString(), 
        score: currentScore // This is the hidden score (90 or 5)
    };

    // Send the data to your server endpoint
    fetch("https://mybackend-production-b618.up.railway.app/record", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToRecord),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Server response failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score recorded successfully.');
        
        // Navigate to a new webpage after success
        window.location.href = 'index2.html'; 
    })
    .catch((error) => {
        console.error('Error recording data:', error);
        alert('Could not record score. Please try again.');
    });
});
