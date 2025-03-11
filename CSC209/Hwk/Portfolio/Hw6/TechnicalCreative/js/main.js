window.onload = function() {
    // Default dimensions
    const defaultWidth = 80;
    const defaultHeight = 130;
    
    // Initialize the game
    let game = new GameOfLife(defaultWidth, defaultHeight);

    // Set up the UI controls
    function setupControls() {
        // Start button
        document.getElementById("startBtn").addEventListener("click", function() {
            game.start();
        });

        // Reset button
        document.getElementById("resetBtn").addEventListener("click", function() {
            game.reset();
        });

        // Next Generation button
        document.getElementById("nextBtn").addEventListener("click", function() {
            game.updateGeneration();
        });

        // Add Pattern button
        document.getElementById("addPatternBtn").addEventListener("click", function() {
            const pattern = document.getElementById("patternSelect").value;
            if (pattern) {
                game.addPattern(pattern);
            }
        });

        // Update Table Dimensions button
        document.getElementById("updateTableBtn").addEventListener("click", function() {
            const widthInput = document.getElementById("setWidth");
            const heightInput = document.getElementById("setHeight");
            
            let newWidth = parseInt(widthInput.value);
            let newHeight = parseInt(heightInput.value);
            
            // Validate inputs
            if (isNaN(newWidth) || newWidth <= 0) {
                newWidth = defaultWidth;
                widthInput.value = defaultWidth;
            }
            
            if (isNaN(newHeight) || newHeight <= 0) {
                newHeight = defaultHeight;
                heightInput.value = defaultHeight;
            }
            
            game.resizeTo(newWidth, newHeight);
        });
    }

    // Initialize UI controls
    setupControls();
};