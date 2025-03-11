var squaresInfo = [
    {
        id: "square1",
        startX: 0,
        startY: 0,
        moveX: 1,
        moveY: 1
    },
    {
        id: "square2",
        startX: 350,
        startY: 350,
        moveX: -1,
        moveY: -1
    },
    {
        id: "square3",
        startX: 0,
        startY: 350,
        moveX: 1,
        moveY: -1
    },
    {
        id: "square4",
        startX: 350,
        startY: 0,
        moveX: -1,
        moveY: 1
    }
];

var intervalIds = []; // variable that store all the interval ids

function initializeSquares() {
    // Set initial positions for squares from the squaresInfo array
    for (var i = 0; i < squaresInfo.length; i++) {
        var square = document.getElementById(squaresInfo[i].id);
        if (square) {
            square.style.left = squaresInfo[i].startX + "px";
            square.style.top = squaresInfo[i].startY + "px";
        }
    }
}

function stopAllAnimations() {
    for (var i = 0; i < intervalIds.length; i++) {
        clearInterval(intervalIds[i]);
    }
    intervalIds = [];
}

function animateSquare(square) {
    var element = document.getElementById(square.id);
    var posX = parseInt(element.style.left) || square.startX;
    var posY = parseInt(element.style.top) || square.startY;
    var dirX = square.moveX;
    var dirY = square.moveY;
    
    var speed = document.getElementById("speed").value;
    
    var interval = setInterval(function() {
        posX += dirX;
        posY += dirY;
        
        if (posX <= 0 || posX >= 350) {
            dirX *= -1;
        }
        
        if (posY <= 0 || posY >= 350) {
            dirY *= -1;
        }
        
        element.style.left = posX + "px";
        element.style.top = posY + "px";
    }, speed);
    
    intervalIds.push(interval);
}

function goInLoops() {
    stopAllAnimations();
    
    for (var i = 0; i < squaresInfo.length; i++) {
        animateSquare(squaresInfo[i]);
    }
}

window.onload = function() {
    initializeSquares(); // Initialize square positions when page loads
    document.getElementById("goInLoopsBtn").addEventListener("click", goInLoops);
};
