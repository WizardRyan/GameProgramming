//Written by Ryan Andersen A02288683 for CS5410
import { Maze } from "./maze.js";

export class Renderer {
    static {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById("canvas");
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");

        this.cellWidth = 0;
        this.maze;
    }

    /**
     * 
     * @param {Maze} maze 
     */
    static drawMaze(maze){
        this.cellWidth = this.canvas.width / maze.mazeSize;
        this.maze = maze;
        this.ctx.beginPath();
        let posX = 0;
        let posY = 0;
        for(let i = 0; i < maze.mazeSize; i++){
            posY = i * this.cellWidth;
            for(let j = 0; j < maze.mazeSize; j++){
                posX = j * this.cellWidth;
                
                let cell = maze.mazeArray[i][j];
                for(let direction of maze.cellDirections){
                    if(cell[`${direction}Wall`]){
                        let xTo = posX;
                        let yTo = posY;
                        this.ctx.moveTo(posX, posY);
                        if(direction == "up" || direction == "down"){
                            xTo += this.cellWidth;
                            if(direction == "down"){
                                yTo += this.cellWidth;
                                this.ctx.moveTo(posX, posY + this.cellWidth);
                            }
                        }
                        else{
                            yTo += this.cellWidth;
                            if(direction == "right"){
                                xTo += this.cellWidth;
                                this.ctx.moveTo(posX + this.cellWidth, posY)
                            }
                        }
                        this.ctx.lineTo(xTo, yTo);
                    }
                }
            }
        }
        this.drawGoal();
        this.ctx.stroke();
    }

    static clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static drawPlayer(playerLocation){
        if(this.maze){
            this.clear();
            this.drawMaze(this.maze);
            this.ctx.fillRect(playerLocation.x * this.cellWidth, playerLocation.y * this.cellWidth, this.cellWidth, this.cellWidth);
        }
    }

    static drawGoal(){
        let endPt = (this.maze.mazeSize -1) * this.cellWidth;
        this.ctx.fillRect(endPt, endPt, this.cellWidth, this.cellWidth, this.cellWidth);
    }
}