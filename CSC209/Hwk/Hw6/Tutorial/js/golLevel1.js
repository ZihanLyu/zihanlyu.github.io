window.onload = function() {

    /**
     * TODOs:
     * - Include buttons that generate popular patterns (preferably drag'n'drop).
     * - Make the game more colorful by creating mapping between specific colors and number generations.
     */
    
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

        this.buildTable();
    }

    function Cell(c)
    {
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
            var num = 0;
            var neighborCoords = this.getNeighborCoords();
            for (var i = 0; i < neighborCoords.length; i += 2) {
                if (this.isNeighbourAlive(i, neighborCoords, table)) {
                    num++;
                }
            }
            return num;
        }

        function getNeighborCoords() {
            var neighborCoords = new Array();
            neighborCoords[0] = this.row - 1; // top row
            neighborCoords[1] = this.column; // top col
            neighborCoords[2] = this.row + 1; // bottom row
            neighborCoords[3] = this.column; // bottom col
            neighborCoords[4] = this.row; // left row
            neighborCoords[5] = this.column - 1; // left col
            neighborCoords[6] = this.row; // right row
            neighborCoords[7] = this.column + 1; // right col
            neighborCoords[8] = this.row - 1; // top left row
            neighborCoords[9] = this.column - 1; // top left col
            neighborCoords[10] = this.row - 1; // top right row
            neighborCoords[11] = this.column + 1; // top right col
            neighborCoords[12] = this.row + 1; // bottom left row
            neighborCoords[13] = this.column - 1; // bottom left col
            neighborCoords[14] = this.row + 1; // bottom right row
            neighborCoords[15] = this.column + 1; // bottom right col
            return neighborCoords;
        }

        function isNeighbourAlive(index, coords, table) {
            var dir_r = coords[ index ];
            var dir_c = coords[ index + 1 ];

            if (dir_r < 0 || dir_c < 0 ||
                dir_r > table.getWidth() - 1 ||
                dir_c > table.getHeight() - 1) {
                return false;
            }

            if(table.getCell(dir_r, dir_c).getAttribute("class") == "alivecell") {
                return true;
            }

            return false;
        }
    }

    function LifeGen(w, h) 
    {
        this.width = w;
        this.height = h;
        this.theTable = new Table(w,h);
        this.lifeAndDeath = lifeAndDeath;

        function lifeAndDeath() {
            this.theTable.syncDrawingStatusToLife();

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

    var tableWidth = 80; // Default width
    var tableHeight = 130; // Default height
    var generator = new LifeGen(tableWidth, tableHeight);

    var intervalId;

    var startBtnListener = function() {
        generator.theTable.syncLifeStatusToDrawing();
        intervalId = setInterval(function() { generator.lifeAndDeath(); }, 50);
        this.setAttribute("disabled", true);
    }

    var resetBtnListener = function() {
        clearInterval(intervalId);
        document.getElementById("startBtn").removeAttribute("disabled");
        
        // Reset the table to default dimensions
        document.getElementById("setWidth").value = tableWidth;
        document.getElementById("setHeight").value = tableHeight;
        
        // Remove existing table and create a new one
        generator.theTable.deleteTable();
        generator = new LifeGen(tableWidth, tableHeight);
    }

    function updateTableDimensions() {
        var newWidth = parseInt(document.getElementById("setWidth").value);
        var newHeight = parseInt(document.getElementById("setHeight").value);
        
        if (isNaN(newWidth) || newWidth <= 0) {
            newWidth = tableWidth;
        }
        
        if (isNaN(newHeight) || newHeight <= 0) {
            newHeight = tableHeight;
        }
        
        // Clear the interval if it's running
        clearInterval(intervalId);
        document.getElementById("startBtn").removeAttribute("disabled");
        
        // Remove the existing table and create a new one
        generator.theTable.deleteTable();
        generator = new LifeGen(newWidth, newHeight);
        
        document.getElementById("setWidth").value = newWidth;
        document.getElementById("setHeight").value = newHeight;
    }

    document.getElementById("updateTableBtn").addEventListener("click", updateTableDimensions);
    document.getElementById("startBtn").addEventListener("click", startBtnListener, false);
    document.getElementById("resetBtn").addEventListener("click", resetBtnListener, false);
}