window.onload = function() {

    /**
     * TODOs:
     * - DONE - Include buttons that generate popular patterns.
     * - Not Started - Make the game more colorful by creating mapping between specific colors and number generations.
     */
    
    // Construct some popular patterns using coordinates.
    const patterns = {
        "101": [
            [0,1],[1,1],[-1,0],[2,0],[-1,-1],[2,-1],[0,-2],[1,-2],//0
            [-3,1],[-3,0],[-3,-1],[-3,-2],[4,1],[4,0],[4,-1],[4,-2],//1s
            [-4,5],[-3,5],[-3,4],[-5,4],[-5,3],[-5,2],[-5,1],[-5,0],[-5,-1],[-5,-2],[-5,-3],[-5,-4],[-5,-5],[-3,-5],[-4,-6],[-3,-6],//left (
            [4,4],[4,5],[5,5],[6,4],[6,3],[6,2],[6,1],[6,0],[6,-1],[6,-2],[6,-3],[6,-4],[6,-5],[4,-5],[4,-6],[5,-6],//right )

        ],
        "glider": [[0, 0], [1, 0], [2, 0], [2, -1], [1, -2]],
        "blinker": [[0, -1], [0, 0], [0, 1]],
        "toad": [[0, 0], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1]],
        "beacon": [[0, 0], [0, 1], [1, 0], [1, 1], [2, 2], [2, 3], [3, 2], [3, 3]],
        "pulsar": [
            [-2, 0], [-2, 1], [-2, 2], [-2, -1], [-2, -2],
            [2, 0], [2, 1], [2, 2], [2, -1], [2, -2],
            [0, -2], [1, -2], [2, -2], [-1, -2], [-2, -2],
            [0, 2], [1, 2], [2, 2], [-1, 2], [-2, 2]
        ]
    };
    
    function Table(w, h)
    {
        this.width = w;
        this.height = h;
        this.htmlTable;
        this.cellArray = new Array();
        this.getWidth = getWidth;
        this.getHeight = getHeight;
        this.getCell = getCell;
        this.buildCellObject = buildCellObject;
        this.assignCellToArray = assignCellToArray;
        this.buildTable = buildTable;
        this.deleteTable = deleteTable;
        this.syncDrawingStatusToLife = syncDrawingStatusToLife;
        this.syncLifeStatusToDrawing = syncLifeStatusToDrawing;
        this.addPattern = addPattern;

        function getWidth() {
            return this.width;
        }

        function getHeight() {
            return this.height;
        }

        function getCell(width, height) {
            return this.cellArray[ width + "_" + height ];
        }

        function buildCellObject(cellHTMLElement, width, height) {
            var newCell = new Cell(cellHTMLElement);
            newCell.setID(width, height);
            newCell.setAttribute("id", width + "_" + height);
            newCell.setAttribute("class", "deadcell");
            newCell.addEventListener("click",function myfunc() {
                if (this.getAttribute("class") == "deadcell") {
                    this.setAttribute("class", "alivecell");
                }
                else {
                    this.setAttribute("class", "deadcell");
                }
            });
            return newCell;
        }

        function assignCellToArray(cell, width, height) {
            this.cellArray[ width + "_" + height ] = cell;
        }

        function buildTable() {
            this.htmlTable = document.createElement("table");
            this.htmlTable.setAttribute("class","petritable");
            this.htmlTable.setAttribute("id", "petritable");

            for (var i = 0; i < this.width ; i++) {
                var rowHTMLElement = this.htmlTable.insertRow(i);
                for (var j = 0; j < this.height ; j++) {
                    var cellHTMLElement = rowHTMLElement.insertCell(j);
                    var newCell = buildCellObject(cellHTMLElement, i, j);
                    this.assignCellToArray(newCell, i, j);
                }
            }

            document.body.appendChild(this.htmlTable);
        }

        function deleteTable() {
            var tableElement = document.getElementById("petritable");
            if (tableElement) {
                tableElement.remove();
            }
        }

        function syncDrawingStatusToLife() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.getCell(i, j);
                    if (currentCell.isAlive()) {
                        currentCell.setAttribute("class", "alivecell");
                    } else {
                        currentCell.setAttribute("class", "deadcell");
                    }
                }
            }
        }

        function syncLifeStatusToDrawing() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.getCell(i, j);
                    if (currentCell.getAttribute("class") == "alivecell") {
                        currentCell.setAlive(true);
                    } else {
                        currentCell.setAlive(false);
                    }
                }
            } 
        }
// This function suppose to define the center row and center column so popular patterns could be added correctly
        function addPattern(patternName, centerRow, centerCol) {

            centerRow = Math.floor(this.width / 2);
            centerCol = Math.floor(this.height / 2);

            patterns[patternName].forEach(coords => {
                const col = centerCol + coords[0];
                const row = centerRow + coords[1];
                
                // check if coordinates are within bounds, if not automatically dies
                if (row >= 0 && row < this.width && col >= 0 && col < this.height) {
                    const cell = this.getCell(row, col);
                    if (cell) {
                        cell.setAttribute("class", "alivecell");
                    }
                }
            });
        }

        this.buildTable();
    }

    function Cell(c) {
        this.element = c;
        this.row;
        this.column;
        this.alive = false;
        this.generation = 0;
        this.setID = setID;
        this.setAttribute = setAttribute;
        this.getAttribute = getAttribute;
        this.addEventListener = addEventListener;
        this.setAlive = setAlive;
        this.isAlive = isAlive;
        this.getNumberOfNeighbours = getNumberOfNeighbours;
        this.getNeighborCoords = getNeighborCoords;
        this.isNeighbourAlive = isNeighbourAlive;

        function setAttribute(attribute, value) {
            this.element.setAttribute(attribute, value);
        }

        function getAttribute(attribute) {
            return this.element.getAttribute(attribute);
        }

        function addEventListener(action, func) {
            this.element.addEventListener(action ,func);
        }

        function setID(row, col) {
            this.row = row;
            this.column = col;
        }

        function setAlive(isAlive) {
            this.alive = isAlive;
        }

        function isAlive() {
            return this.alive;
        }
        
        function getNumberOfNeighbours(table) {
            let num = 0;
            let neighborCoords = this.getNeighborCoords();
        
            for (let [row, col] of neighborCoords) {
                if (this.isNeighbourAlive(row, col, table)) {
                    num++;
                }
            }
            return num;
        }

        function getNeighborCoords() {
            return [
                [this.row - 1, this.column],  // Top
                [this.row + 1, this.column],  // Bottom
                [this.row, this.column - 1],  // Left
                [this.row, this.column + 1],  // Right
                [this.row - 1, this.column - 1],  // Top-Left
                [this.row - 1, this.column + 1],  // Top-Right
                [this.row + 1, this.column - 1],  // Bottom-Left
                [this.row + 1, this.column + 1]   // Bottom-Right
            ];
        }
        
        function isNeighbourAlive(row, col, table) {
            if (row < 0 || col < 0 || row >= table.getWidth() || col >= table.getHeight()) {
                return false;
            }
            
            return table.getCell(row, col).getAttribute("class") === "alivecell";
        }
    }

    function LifeGen(w, h) 
    {
        this.width = w;
        this.height = h;
        this.theTable = new Table(w,h);
        this.lifeAndDeath = lifeAndDeath;

        function lifeAndDeath() {
            this.theTable.syncLifeStatusToDrawing();

            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.theTable.getCell(i, j);
                    var nOn = currentCell.getNumberOfNeighbours(this.theTable);
                    if (currentCell.isAlive()) {
                        if (nOn < 2) {
                            currentCell.setAlive(false);
                        } else if (nOn == 2 || nOn == 3) {
                            currentCell.generation++;
                        } else {
                            currentCell.setAlive(false);
                        }
                    } else {
                        if (nOn == 3) {
                            currentCell.setAlive(true);
                        }
                    }
                }
            }
        }
    }

    var tableWidth = 80; // default table width
    var tableHeight = 130; // default table height
    var generator = new LifeGen(tableWidth, tableHeight);

    var intervalId;

    var startBtnListener = function() {
        generator.theTable.syncLifeStatusToDrawing();
        intervalId = setInterval(function() { generator.lifeAndDeath(); }, 50);
        this.setAttribute("disabled", true);
        document.getElementById("nextBtn").setAttribute("disabled", true);
    }

    var resetBtnListener = function() {
        clearInterval(intervalId);
        document.getElementById("startBtn").removeAttribute("disabled");
        document.getElementById("nextBtn").removeAttribute("disabled");
        
        // eeset the table to default dimensions
        document.getElementById("setWidth").value = tableWidth;
        document.getElementById("setHeight").value = tableHeight;
        
        // eemove existing table and create a new one
        generator.theTable.deleteTable();
        generator = new LifeGen(tableWidth, tableHeight);
    }

    var nextBtnListener = function() {
        generator.theTable.syncLifeStatusToDrawing(); // make sure the logic reads the correct state
        generator.lifeAndDeath(); // compute the next state
        generator.theTable.syncDrawingStatusToLife(); // ensure user interface updates properly
    };

    function updateTableDimensions() {
        var newWidth = parseInt(document.getElementById("setWidth").value);
        var newHeight = parseInt(document.getElementById("setHeight").value);
        
        if (isNaN(newWidth) || newWidth <= 0) {
            newWidth = tableWidth;
        }
        
        if (isNaN(newHeight) || newHeight <= 0) {
            newHeight = tableHeight;
        }
        
        // clear the interval if it's running
        clearInterval(intervalId);
        document.getElementById("startBtn").removeAttribute("disabled");
        document.getElementById("nextBtn").removeAttribute("disabled");
        
        // eemove the existing table and create a new one
        generator.theTable.deleteTable();
        generator = new LifeGen(newWidth, newHeight);
        
        document.getElementById("setWidth").value = newWidth;
        document.getElementById("setHeight").value = newHeight;
    }

    function addPatternHandler() {
        var patternSelect = document.getElementById("patternSelect");
        var selectedPattern = patternSelect.value;
        
        if (selectedPattern) {
            generator.theTable.addPattern(selectedPattern);
        }
    }

    document.getElementById("updateTableBtn").addEventListener("click", updateTableDimensions);
    document.getElementById("startBtn").addEventListener("click", startBtnListener, false);
    document.getElementById("resetBtn").addEventListener("click", resetBtnListener, false);
    document.getElementById("addPatternBtn").addEventListener("click", addPatternHandler, false);
    document.getElementById("nextBtn").addEventListener("click", nextBtnListener, false);
}