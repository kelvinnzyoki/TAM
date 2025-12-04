// Select all buttons
const buttons = document.querySelectorAll(".menu-btn");

// Add click event to each button
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const page = btn.getAttribute("data-target");
        window.location.href = page; // navigate to that page
    });
});
