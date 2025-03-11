class Cell {
    constructor(element, row, col) {
        this.element = element;
        this.row = row;
        this.col = col;
        this.alive = false;
        this.generation = 0;

        this.element.setAttribute("class", "deadcell");
        this.element.addEventListener("click", () => this.toggleState());
    }

    toggleState() {
        this.alive = !this.alive;
        this.updateClass();
    }

    updateClass() {
        this.element.setAttribute("class", this.alive ? "alivecell" : "deadcell");
    }

    setAlive(isAlive) {
        this.alive = isAlive;
        this.updateClass();
    }

    isAlive() {
        return this.alive;
    }

    getNeighborCoords() {
        return [
            [this.row - 1, this.col],
            [this.row + 1, this.col],
            [this.row, this.col - 1],
            [this.row, this.col + 1],
            [this.row - 1, this.col - 1],
            [this.row - 1, this.col + 1],
            [this.row + 1, this.col - 1],
            [this.row + 1, this.col + 1]
        ];
    }
}