// All tickable boxes
const boxes = [
    "c0", "c15", "c20", "c25", "c30", "c30plus"
];

// Make sure only one checkbox can be selected at a time
boxes.forEach(id => {
    const box = document.getElementById(id);

    box.addEventListener("change", () => {
        if (box.checked) {
            // Untick all others
            boxes.forEach(otherID => {
                if (otherID !== id) {
                    document.getElementById(otherID).checked = false;
                }
            });

            // Clear "other" input if a checkbox is picked
            document.getElementById("otherInput").value = "";
        }
    });
});

// If user types in "Other", all checkboxes untick
document.getElementById("otherInput").addEventListener("input", () => {
    boxes.forEach(id => {
        document.getElementById(id).checked = false;
    });
});
