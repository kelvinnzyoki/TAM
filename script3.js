// You can expand behavior later. For now, this just listens.
const avoidCheck = document.getElementById("avoidCheck");
const relapseCheck = document.getElementById("relapseCheck");

avoidCheck.addEventListener("change", () => {
    console.log("Avoided ticked:", avoidCheck.checked);
});

relapseCheck.addEventListener("change", () => {
    console.log("Relapsed ticked:", relapseCheck.checked);
});
