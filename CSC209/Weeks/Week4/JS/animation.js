var currentRPos = null; //global variable to define the squre position
var currentBPos = null;
function moveRed()
{   
    if (currentRPos !== null){ // Reset the interval when the function is called
        clearInterval(currentRPos);
    } 
    var redSquare = document.getElementById("redSq");   
    var redPos = 0;
    var rSpeed = document.getElementById("redSpeed").value;
    var stepRedId = setInterval(stepRed, rSpeed); // The step speed of red squre is a selectable rSpeed.
    currentRPos = stepRedId;

    function stepRed() {
        if (redPos == 350) {
            clearInterval(stepRedId);
            currentRPos = null;
        } else {
            redPos++; 
            redSquare.style.top = redPos + 'px'; 
            redSquare.style.left = redPos + 'px';
        }
    }
}

function moveBlue()
{   
    if (currentBPos !== null){ // Reset the interval when the function is called
        clearInterval(currentBPos);
    }
    var blueSquare = document.getElementById("blueSq");   
    var bluePos = 0;
    var bSpeed = document.getElementById("blueSpeed").value;
    var stepBlueId = setInterval(stepBlue, bSpeed); // The step speed of blue squre is a selectable rSpeed.
    currentBPos = stepBlueId;

    function stepBlue() {
        if (bluePos == 350) {
            clearInterval(stepBlueId);
            currentBPos = null;
        } else {
            bluePos++; 
            blueSquare.style.bottom = bluePos + 'px'; 
            blueSquare.style.right = bluePos + 'px';
        }
    }
}


