//Written by Ryan Andersen A02288683 for CS5410
export class Maze{
    constructor(mazeSize){
        this.mazeSize = mazeSize;
        this.cellDirections = ["up", "down", "left", "right"];
        this.oppositeDirections = {right: "left", left: "right", up: "down", down: "up"};
        this.frontierCells = [];
        this.generateMaze();
        this.shortestPath = undefined;
        this.solveMaze([0,0]);
    }

    generateMaze(){
        this.generateBlockedOutMaze();
        this.markTopLeft();
        this.runPrim();
    }

    runPrim(){
        while(this.frontierCells.length > 0){
            let fCell = this.getRandomFrontier();
            let direction = this.getRandomAdjacentConnectedCellDirection(fCell);
            fCell[`${direction}Wall`] = false;
            fCell[direction][`${this.oppositeDirections[direction]}Wall`] = false;
            fCell.isConnected = true;
            fCell.isFrontier = false;
            this.frontierCells = this.frontierCells.filter(cell => !(cell.x == fCell.x && cell.y == fCell.y));

            this.markAdjacentAsFrontier(fCell);
        }
    }


    markAdjacentAsFrontier(cell){
        for(let direction of this.cellDirections){
            if(cell[direction] && !cell[direction].isConnected){
                cell[direction].isFrontier = true;
                this.frontierCells.push(cell[direction]);
            }
        }
    }

    getRandomFrontier(){
        return this.frontierCells[Math.floor(Math.random() * this.frontierCells.length)];
    }

    getRandomAdjacentConnectedCellDirection(cell){
        let selectedCell = null;
        let direction = "";
        while(selectedCell == null){
            let num = Math.floor(Math.random() * 4);
            direction = this.cellDirections[num];
            selectedCell = cell[direction];
            if(selectedCell == null || !selectedCell.isConnected){
                selectedCell = null;
            }
        }
        return direction
    }

    markTopLeft(){
        this.mazeArray[0][0].isConnected = true;
        this.mazeArray[0][0].isFrontier = false;
        this.mazeArray[0][0].right.isFrontier = true;
        this.mazeArray[0][0].down.isFrontier = true;
        this.frontierCells.push(this.mazeArray[0][0].right);
        this.frontierCells.push(this.mazeArray[0][0].down);
    }

    generateBlockedOutMaze(){
        this.mazeArray = [];
        this.fillCells();
        this.linkCells();
    }

    fillCells(){
        for(let i = 0; i < this.mazeSize; i++){
            let row = [];
            for(let j = 0; j < this.mazeSize; j++){
                row.push(new PrimCell(i, j));
            }
            this.mazeArray.push(row);
        }
    }

    linkCells(){
        for(let i = 0; i < this.mazeSize; i++){
            for(let j = 0; j < this.mazeSize; j++){
                if(i - 1 >= 0){
                    this.mazeArray[i][j].up = this.mazeArray[i - 1][j];
                }
                if(i + 1 < this.mazeSize){
                    this.mazeArray[i][j].down = this.mazeArray[i + 1][j];
                }
                if(j + 1 < this.mazeSize){
                    this.mazeArray[i][j].right = this.mazeArray[i][j + 1];
                }
                if(j - 1 >= 0){
                    this.mazeArray[i][j].left = this.mazeArray[i][j - 1];
                }
            }
        } 
    }

    getMazeArray(){
        return this.mazeArray;
    }

    solveMaze(startingPoint){
        let toVisit = [];
        toVisit.push(startingPoint);
        
        let visited = [];
        let prev = [];
        
        for(let i =0; i < this.mazeSize; i++){
            visited.push([]);
            prev.push([]);
            for(let j = 0; j < this.mazeSize; j++){
                visited[i].push(false);
                prev[i].push(null);
            }
        }

        visited[startingPoint[0]][startingPoint[1]] = true;

        while (toVisit.length > 0){
            let cellIndex = toVisit.pop();
            let neighbors = this.getNeighbors(cellIndex);
            for(let next of neighbors){
                if(!visited[next[0]][next[1]]){
                    toVisit.push(next);
                    visited[next[0]][next[1]] = true;
                    prev[next[0]][next[1]] = cellIndex;
                }
            }
        }
        
        let path = [];
        for(let at = [this.mazeSize - 1, this.mazeSize - 1]; at != null; at = prev[at[0]][at[1]]){
            path.push(at);
        }
        path.reverse();
        this.shortestPath = path;
    }

    getNeighbors(cellIndex){
        let neighbors = [];

        let cell = this.mazeArray[cellIndex[0]][cellIndex[1]];
        for(let direction of this.cellDirections){
            if(cell[direction] && !cell[`${direction}Wall`]){
                neighbors.push([cell[direction].x, cell[direction].y]);
            }
        }
        return neighbors;
    }

    logMaze(){
        for(let row of this.mazeArray){
            for(let cell of row){
                console.log(cell);
            }
        }
    }

}

export class PrimCell {
    constructor(x, y){
        this.isFrontier = false;
        this.isConnected = false;
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;
        this.upWall = true;
        this.rightWall = true;
        this.leftWall = true;
        this.downWall = true;
        this.x = x;
        this.y = y;
    }
}