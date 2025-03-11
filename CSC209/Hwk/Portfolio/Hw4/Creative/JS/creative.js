var creatures = [
    {
        id: "fish",
        emoji: "&#128032;",
        startX: 20,
        startY: 50,
        moveX: 2,
        moveY: 1,
        speedId: "fishSpeed",
        directionId: "fishDirection",
        size: 30
    },
    {
        id: "turtle",
        emoji: "&#128034;",
        startX: 350,
        startY: 5,
        moveX: -1,
        moveY: 0,
        speedId: "turtleSpeed",
        directionId: "turtleDirection",
        size: 30
    },
    {
        id: "jellyfish",
        emoji: "&#129724;",
        startX: 200,
        startY: 350,
        moveX: 0,
        moveY: -1,
        speedId: "jellyfishSpeed",
        directionId: "jellyfishDirection",
        size: 30
    },
    {
        id: "crab",
        emoji: "&#129408;",
        startX: 50,
        startY: 350,
        moveX: 1,
        moveY: -0.5,
        speedId: "crabSpeed",
        directionId: "crabDirection",
        size: 30
    }
];

var intervalIds = []; 
var aquariumWidth = 400;
var aquariumHeight = 400;

function addDecorations() {
    const aquarium = document.getElementById("aquarium");
    
    // Add bubbles
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        const size = Math.random() * 10 + 5;
        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.left = Math.random() * aquariumWidth + "px";
        bubble.style.bottom = "-" + size + "px";
        bubble.style.animationDuration = (Math.random() * 10 + 10) + "s";
        aquarium.appendChild(bubble);
    }
    
    // Add seaweed
    for (let i = 0; i < 7; i++) {
        const seaweed = document.createElement("div");
        seaweed.className = "seaweed";
        const height = Math.random() * 80 + 50;
        seaweed.style.height = height + "px";
        seaweed.style.left = (Math.random() * (aquariumWidth - 50) + 25) + "px";
        seaweed.style.animationDelay = (Math.random() * 2) + "s";
        aquarium.appendChild(seaweed);
    }
}

function initializeCreatures() {
    for (var i = 0; i < creatures.length; i++) {
        var creature = creatures[i];
        var element = document.getElementById(creature.id);
        if (element) {
            element.style.left = creature.startX + "px";
            element.style.top = creature.startY + "px";
            element.innerHTML = creature.emoji; 
        }
    }
}

function stopAllAnimations() {
    for (var i = 0; i < intervalIds.length; i++) {
        clearInterval(intervalIds[i]);
    }
    intervalIds = [];
}

function getMovement(creature, direction) {
    let moveX = creature.moveX;
    let moveY = creature.moveY;

    
    switch(direction) {
        case "horizontal":
            moveX = moveX > 0 ? 2 : -2;
            moveY = 0;
            break;
        case "vertical":
            moveX = 0;
            moveY = moveY > 0 ? 2 : -2;
            break;
        case "diagonal":
            moveX = moveX > 0 ? -2 : 2; // The fish emoji is facing left, to prevent backward swimming
            moveY = moveY > 0 ? 2 : -2;
            break;
    }
    
    return { moveX, moveY, direction };
}

function animateCreature(creature) {
    var element = document.getElementById(creature.id);
    var posX = parseInt(element.style.left) || creature.startX;
    var posY = parseInt(element.style.top) || creature.startY;
    
    var speed = document.getElementById(creature.speedId).value;
    var direction = document.getElementById(creature.directionId).value;
    var movement = getMovement(creature, direction);
    var dirX = movement.moveX;
    var dirY = movement.moveY;
    
    var interval = setInterval(function() {
        
        posX += dirX;
        posY += dirY;
        
        if (posX <= 0 || posX >= aquariumWidth - creature.size) {
            dirX *= -1;
        }
        
        if (posY <= 0 || posY >= aquariumHeight - creature.size) {
            dirY *= -1;
        }
        
        element.style.left = posX + "px";
        element.style.top = posY + "px";
        
    }, speed);
    
    intervalIds.push(interval);
}

function startAllAnimations() {
    stopAllAnimations();
    
    for (var i = 0; i < creatures.length; i++) {
        animateCreature(creatures[i]);
    }
}

window.onload = function() {
    addDecorations();
    initializeCreatures();
    document.getElementById("startAllBtn").addEventListener("click", startAllAnimations);
    document.getElementById("stopAllBtn").addEventListener("click", stopAllAnimations);
    document.getElementById("resetBtn").addEventListener("click", function() {
        stopAllAnimations();
        initializeCreatures();
    });
};