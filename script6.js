const boxes = ["c0", "c15", "c20", "c25", "c30", "c30plus"];
const otherInput = document.getElementById("otherInput");
const recordBtn = document.getElementById("recordBtn");

let currentScore = 0;

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
            recordBtn.disabled = true;
        }
    });
});

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
            currentScore = 8;
        } else if (score >= 26 && score <= 29) {
            currentScore = 9;
        } else if (score === 30) {
            currentScore = 10;
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
            currentScore = 16;
        } else {
            recordBtn.disabled = true;
        }
    }
}, 150);

if (otherInput) {
    otherInput.addEventListener("input", handleOtherInput);
}

recordBtn.addEventListener('click', async function() {
    if (recordBtn.disabled && recordBtn.innerText === "Saving...") return;

    console.log("📤 Submitting squats score:", currentScore);

    recordBtn.disabled = true;
    recordBtn.innerText = "Saving...";

    try {
        const data = await API.request("/squats", {
            method: 'POST',
            body: JSON.stringify({
                score: Number(currentScore),
                date: new Date().toISOString().split('T')[0]
            })
        });

        console.log("📥 Server response:", data);

        if (data.success) {
            showToast("✅ Alpha Progress Recorded");
            
            // Navigate back after short delay
            setTimeout(() => {
                window.location.replace('index2.html');
            }, 1000);
        } else {
            showToast(data.message || "Failed to record");
            recordBtn.disabled = false;
            recordBtn.innerText = "Record & Go!";
        }
    } catch (error) {
        console.error("❌ Submission error:", error);
        showToast('Server error. Please try again.');
        recordBtn.disabled = false;
        recordBtn.innerText = "Record & Go!";
    }
});
