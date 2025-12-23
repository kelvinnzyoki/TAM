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
    const value = parseInt(otherInput.value);

    // If user starts typing, uncheck all boxes
    if (otherInput.value !== "") {
        boxes.forEach(id => document.getElementById(id).checked = false);
        recordBtn.disabled = false;

        // "If user inputs a value more than 30, score is 70"
        if (value > 30) {
            currentScore = 70;
        } else {
            currentScore = 20; // Default score for lower numbers
        }
    } else {
        recordBtn.disabled = true;
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
        const response = await fetch("https://mybackend-production-b618.up.railway.app/squats", {
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
