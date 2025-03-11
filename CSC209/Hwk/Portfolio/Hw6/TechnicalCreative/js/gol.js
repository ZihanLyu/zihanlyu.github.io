class GameOfLife {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.table = new Table(width, height);
        this.intervalId = null;
    }

    updateGeneration() {
        const changes = [];

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const cell = this.table.getCell(i, j);
                const neighbors = cell.getNeighborCoords().filter(([r, c]) => {
                    if (r < 0 || c < 0 || r >= this.width || c >= this.height) {
                        return false;
                    }
                    const neighbor = this.table.getCell(r, c);
                    return neighbor && neighbor.isAlive();
                }).length;

                if (cell.isAlive() && (neighbors < 2 || neighbors > 3)) {
                    changes.push(() => cell.setAlive(false));
                } else if (!cell.isAlive() && neighbors === 3) {
                    changes.push(() => cell.setAlive(true));
                }
            }
        }

        changes.forEach(change => change());
    }

    reset() {
        this.stop();
        this.table.deleteTable();
        this.table = new Table(this.width, this.height);
    }

    resizeTo(width, height) {
        this.stop();
        this.width = width;
        this.height = height;
        this.table.deleteTable();
        this.table = new Table(width, height);
    }

    start() {
        if (this.intervalId) {
            this.stop();
        }
        this.intervalId = setInterval(() => this.updateGeneration(), 200);
        document.getElementById("startBtn").setAttribute("disabled", true);
        document.getElementById("nextBtn").setAttribute("disabled", true);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            document.getElementById("startBtn").removeAttribute("disabled");
            document.getElementById("nextBtn").removeAttribute("disabled");
        }
    }

    addPattern(patternName) {
        this.table.addPattern(patternName);
    }
}