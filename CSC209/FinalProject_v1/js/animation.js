function createGoldfish() {
    const goldfish = document.createElement('img');
    goldfish.src = '../images/goldfish.png';
    goldfish.className = 'goldfish-animation';
    goldfish.alt = 'Swimming goldfish';
    
    // randomize animation parameters
    const duration = Math.random() * 10 + 10; 
    const vertical = Math.random() * 30 + 10;
    const size = Math.random() * 50 + 100; // randomize fish size between 100-150px
    
    goldfish.style.animation = `
        swim ${duration}s linear infinite,
        swim-vertical ${vertical / 10}s ease-in-out infinite alternate-reverse
    `;
    goldfish.style.width = `${size}px`;
    
    document.body.appendChild(goldfish);
    
    // remove fish when animation completes
    setTimeout(() => {
        goldfish.remove();
    }, duration * 1000);
}

// create multiple fish every 5 seconds
function startFishAnimation() {
    createGoldfish();
    setInterval(() => {
        if(Math.random() > 0.5) { // 50% chance to create new fish
            createGoldfish();
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', startFishAnimation);