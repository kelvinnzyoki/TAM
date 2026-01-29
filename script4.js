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
// --- C. Submit to Backend (Corrected for auth.js & Production) ---
recordBtn.addEventListener("click", async () => {
    // Basic validation before sending
    if (recordBtn.disabled) return;

    const payload = {
        date: new Date().toISOString(),
        score: Number(currentScore) // This is set by your checkbox/input logic
    };

    recordBtn.disabled = true;
    recordBtn.innerText = "Saving...";

    try {
        // Use API.request from your auth.js bridge
        // It handles credentials: "include" and 401 token refreshes automatically
        const data = await API.request("/pushups", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (data.success) {
            alert("✅ Alpha Progress Recorded!");
            window.location.href = "index2.html";
        } else {
            alert("Error: " + (data.message || "Failed to sync"));
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        console.error("Submission failed:", error);
        alert("Server connection failed or session expired.");
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
