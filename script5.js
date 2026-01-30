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


// --- C. Submit to Backend (Refactored for Production) ---
recordBtn.addEventListener("click", async () => {
    // Ensure button is only active if valid input exists
    if (recordBtn.disabled) return;

    // Use a clean payload. Date is optional as server defaults to CURRENT_DATE,
    // but sending it ensures the score is recorded for the user's local day.
    const payload = {
        date: new Date().toISOString().split('T')[0], // Sends YYYY-MM-DD
        score: Number(currentScore) // Forces numerical format
    };

    recordBtn.disabled = true;
    recordBtn.innerText = "Syncing...";

    try {
        // We use API.request from auth.js which handles:
        // 1. Sending HttpOnly cookies (credentials: "include")
        // 2. Automatic token refresh if session expired
        const data = await API.request("/situps", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (data.success) {
            showToast("✅ Score Recorded!");
            
        } else {
            showToast("Sync Failed: " + (data.message || "Unknown error"));
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        console.error("Submission error:", error);
        showToast("Server connection failed. Please check your internet.");
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
