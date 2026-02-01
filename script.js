document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.querySelector('.blob-1').style.transform = 
        `translate(${x * 50}px, ${y * 50}px)`;
    document.querySelector('.blob-2').style.transform = 
        `translate(${-x * 50}px, ${-y * 50}px)`;
});
