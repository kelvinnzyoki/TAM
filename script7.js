const boxes = ["c0", "c15", "c20", "c25", "c30", "c30plus"];
const otherInput = document.getElementById("otherInput");
const recordBtn = document.getElementById("recordBtn");

let currentScore = 0;

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle Checkbox Logic
boxes.forEach(id => {
    const box = document.getElementById(id);
    if (!box) return;

    box.addEventListener("change", () => {
        if (box.checked) {
            boxes.forEach(otherID => {
                const otherBox = document.getElementById(otherID);
                if (otherID !== id && otherBox) otherBox.checked = false;
            });
            
            if (otherInput) otherInput.value = "";
            
            currentScore = parseInt(box.getAttribute("data-score")) || 0;
            recordBtn.disabled = false;
        } else {
            const anyChecked = boxes.some(id => {
                const b = document.getElementById(id);
                return b && b.checked;
            });
            recordBtn.disabled = !anyChecked && (!otherInput || !otherInput.value);
        }
    });
});

// Handle "Other" Input Logic with debouncing
const handleOtherInput = debounce(() => {
    const score = parseInt(otherInput.value);

    if (!isNaN(score) && otherInput.value !== "") {
        boxes.forEach(id => {
            const box = document.getElementById(id);
            if (box) box.checked = false;
        });
        recordBtn.disabled = false;

        if (score === 0) {
            currentScore = 0;
        } else if (score >= 1 && score <= 250) {
            currentScore = 1;
        } else if (score >= 251 && score <= 500) {
            currentScore = 2;
        } else if (score >= 501 && score <= 999) {
            currentScore = 3;
        } else if (score === 1000) {
            currentScore = 4;
        } else if (score >= 1001 && score <= 1999) {
            currentScore = 5;
        } else if (score === 2000) {
            currentScore = 6;
        } else if (score >= 2001 && score <= 2999) {
            currentScore = 7;
        } else if (score === 3000) {
            currentScore = 8;
        } else if (score >= 3001 && score <= 3999) {
            currentScore = 9;
        } else if (score === 4000) {
            currentScore = 10;
        } else if (score >= 4001 && score <= 4999) {
            currentScore = 11;
        } else if (score === 5000) {
            currentScore = 12;
        } else if (score >= 5001 && score <= 7000) {
            currentScore = 13;
        } else if (score >= 7001 && score <= 9000) {
            currentScore = 14;
        } else if (score >= 9001 && score <= 12999) {
            currentScore = 15;
        } else if (score >= 13000 && score <= 200000) {
            currentScore = 16;
        } else {
            recordBtn.disabled = true;
        }
    }
}, 150);

if (otherInput) {
    otherInput.addEventListener("input", handleOtherInput);
}

// Submit to Backend
recordBtn.addEventListener("click", async () => {
    if (recordBtn.disabled) return;

    const payload = {
        date: new Date().toISOString().split('T')[0],
        score: Number(currentScore)
    };

    recordBtn.disabled = true;
    recordBtn.innerText = "Syncing...";

    try {
        const data = await API.request("/steps", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (data.success) {
            showToast("✅ Steps Recorded!");
        } else {
            showToast("Sync Failed: " + (data.message || "Please try again"));
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        console.error("Steps submission error:", error);
        showToast("Server connection failed. Check your network.");
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
