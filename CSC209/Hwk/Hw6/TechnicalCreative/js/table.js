class Table {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cellArray = {};
        this.patterns = this.getPatterns();
        this.buildTable();
    }

    getPatterns() {
        return {
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
    }

    buildTable() {
        this.htmlTable = document.createElement("table");
        this.htmlTable.setAttribute("class", "petritable");
        this.htmlTable.setAttribute("id", "petritable");

        for (let i = 0; i < this.width; i++) {
            const row = this.htmlTable.insertRow(i);
            for (let j = 0; j < this.height; j++) {
                const cellElement = row.insertCell(j);
                const cell = new Cell(cellElement, i, j);
                this.cellArray[`${i}_${j}`] = cell;
            }
        }
        document.body.appendChild(this.htmlTable);
    }

    deleteTable() {
        const tableElement = document.getElementById("petritable");
        if (tableElement) {
            tableElement.remove();
        }
    }

    getCell(row, col) {
        return this.cellArray[`${row}_${col}`];
    }

    addPattern(patternName) {
        const centerRow = Math.floor(this.width / 2);
        const centerCol = Math.floor(this.height / 2);

        if (!this.patterns[patternName]) return;

        this.patterns[patternName].forEach(([x, y]) => {
            const row = centerRow + y;
            const col = centerCol + x;

            if (row >= 0 && row < this.width && col >= 0 && col < this.height) {
                const cell = this.getCell(row, col);
                if (cell) {
                    cell.setAlive(true);
                }
            }
        });
    }
}