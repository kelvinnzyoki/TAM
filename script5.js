const boxes = ["c0", "c15", "c20", "c25", "c30", "c30plus"];
const otherInput = document.getElementById("otherInput");
const recordBtn = document.getElementById("recordBtn");

let currentScore = 0;

// --- A. Handle Checkbox Logic ---
boxes.forEach(id => {
    const box = document.getElementById(id);

    box.addEventListener("change", () => {
        if (box.checked) {
            // Untick all other checkboxes
            boxes.forEach(otherID => {
                if (otherID !== id) document.getElementById(otherID).checked = false;
            });
            // Clear other input
            otherInput.value = "";
            
            // Set current score from data attribute
            currentScore = parseInt(box.getAttribute("data-score"));
            recordBtn.disabled = false;
        } else {
            recordBtn.disabled = true;
        }
    });
});

// --- B. Handle "Other" Input Logic ---
otherInput.addEventListener("input", () => {
    const score = parseInt(otherInput.value);

    // If user starts typing, uncheck all boxes
    if (!isNaN(score) && otherInput.value !== "") {
        boxes.forEach(id => document.getElementById(id).checked = false);
        recordBtn.disabled = false;

        // "If user inputs a value more than 30, score is 70"
        if (score === 0) {
        currentScore = 0;
        } else if (score >= 1 && score <= 10) {
        currentScore = 2;
        } else if (score >= 11 && score <= 14) {
        currentScore = 3;
        } else if (score === 15) {
        currentScore = 4;
        } else if (score >= 16 && score <= 19) {
        currentScore = 5;
        } else if (score === 20) {
        currentScore = 6;
        } else if (score >= 21 && score <= 24) {
        currentScore = 7;
        } else if (score === 25) {
        currentScore  = 8;
        } else if (score >= 26 && score <= 29) {
        currentScore  = 9;
        } else if (score === 30) {
        currentScore  = 10;
        } else if (score >= 31 && score <= 34) {
        currentScore = 11;
        } else if (score === 35) {
        currentScore = 12;
        } else if (score >= 36 && score <= 40) {
        currentScore = 13;
        } else if (score >= 41 && score <= 50) {
        currentScore = 14;
        } else if (score >= 51 && score <= 70) {
        currentScore = 15;
        } else if (score >= 71 && score <= 1000) {
        currentScore  = 16;
        }
        else {
        recordBtn.disabled = true;
    }
    }
});

// --- C. Submit to Backend ---
recordBtn.addEventListener("click", async () => {
    // Retrieve email saved from login page
    const email = localStorage.getItem("userEmail");

    if (!email) {
        alert("Session missing. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    const payload = {
        email: email,
        date: new Date().toISOString(),
        score: currentScore
    
    };

    recordBtn.disabled = true;
    recordBtn.innerText = "Saving...";

    try {
        const response = await fetch("https://mybackend-production-b618.up.railway.app/record-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Score Recorded!");
            window.location.href = "index2.html";
        } else {
            const err = await response.json();
            alert("Error: " + err.error);
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        alert("Server connection failed.");
        recordBtn.disabled = false;
    }
});
