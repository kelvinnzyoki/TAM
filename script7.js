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
            if (otherID !== id) document.getElementById(otherID).checked = false;  
        });  
        otherInput.value = "";  
        currentScore = parseInt(box.getAttribute("data-score"));  
        recordBtn.disabled = false;  
    } else {  
        // Only disable if nothing else is selected
        const anyChecked = boxes.some(id => document.getElementById(id).checked);
        recordBtn.disabled = !anyChecked && !otherInput.value;
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
    currentScore  = 8;  
    } else if (score >= 3001 && score <= 3999) {  
    currentScore  = 9;  
    } else if (score === 4000) {  
    currentScore  = 10;  
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
/*const email = localStorage.getItem("userEmail");

if (!email) {  
    alert("Session missing. Please log in again.");  
    window.location.href = "index.html";  
    return;  
}  */

const payload = {  
    /*email: email,  */
    date: new Date().toISOString(),  
    score: currentScore  
  
};  

recordBtn.disabled = true;  
recordBtn.innerText = "Saving...";  

try {  
    const response = await fetch("https://cctamcc.site/steps", {  
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
