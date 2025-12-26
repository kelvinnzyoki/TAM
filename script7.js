document.addEventListener("DOMContentLoaded", () => {

    const boxes = ["c0", "c15", "c20", "c25", "c30", "c30plus"];
    const otherInput = document.getElementById("otherInput");
    const recordBtn = document.getElementById("recordBtn");

    let currentScore = 0;

    // --- A. Handle Checkbox Logic ---
    boxes.forEach(id => {
        const box = document.getElementById(id);

        box.addEventListener("change", () => {
            if (box.checked) {
                boxes.forEach(otherID => {
                    if (otherID !== id)
                        document.getElementById(otherID).checked = false;
                });

                otherInput.value = "";
                currentScore = parseInt(box.dataset.score);
                recordBtn.disabled = false;
            } else {
                recordBtn.disabled = true;
            }
        });
    });

    // --- B. Other Input ---
    otherInput.addEventListener("input", () => {
        const score = parseInt(otherInput.value);

        if (!isNaN(score)) {
            boxes.forEach(id => document.getElementById(id).checked = false);
            recordBtn.disabled = false;

            if (score === 0) currentScore = 0;
            else if (score <= 250) currentScore = 1;
            else if (score <= 500) currentScore = 2;
            else if (score <= 999) currentScore = 3;
            else if (score === 1000) currentScore = 4;
            else if (score <= 1999) currentScore = 5;
            else if (score === 2000) currentScore = 6;
            else if (score <= 2999) currentScore = 7;
            else if (score === 3000) currentScore = 8;
            else if (score <= 3999) currentScore = 9;
            else if (score === 4000) currentScore = 10;
            else if (score <= 4999) currentScore = 11;
            else if (score === 5000) currentScore = 12;
            else if (score <= 7000) currentScore = 13;
            else if (score <= 9000) currentScore = 14;
            else if (score <= 12999) currentScore = 15;
            else currentScore = 16;
        }
    });

    // --- Submit ---
    recordBtn.addEventListener("click", async () => {
        const email = localStorage.getItem("userEmail");

        if (!email) {
            alert("Session missing. Please log in again.");
            window.location.href = "index.html";
            return;
        }

        recordBtn.disabled = true;
        recordBtn.innerText = "Saving...";

        try {
            const res = await fetch("https://mybackend-production-b618.up.railway.app/steps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    date: new Date().toISOString(),
                    score: currentScore
                })
            });

            if (!res.ok) throw new Error("Server error");

            alert("Score Recorded!");
            window.location.href = "index2.html";
        } catch (err) {
            alert("Server connection failed.");
            recordBtn.disabled = false;
        }
    });
});
