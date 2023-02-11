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
        this.setImages();
    }

    /**
     * 
     * @param {Maze} maze 
     */
    static drawMaze(maze){
        this.ctx.drawImage(this.bgImg, 0, 0, this.canvas.width, this.canvas.width);
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
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#8a2450";
        this.ctx.stroke();
    }

    static clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static drawPlayer(playerLocation){
        this.ctx.drawImage(this.oreoImg, playerLocation.x * this.cellWidth, playerLocation.y * this.cellWidth, this.cellWidth, this.cellWidth);
    }

    static drawGoal(){
        let endPt = (this.maze.mazeSize -1) * this.cellWidth;
        this.ctx.drawImage(this.foodBowlImg, endPt, endPt, this.cellWidth, this.cellWidth);
    }

    static drawBreadCrumbs(breadcrumbs){
        for(let breadcrumb of breadcrumbs){
            this.ctx.drawImage(this.pawPrintsImg, breadcrumb.x * this.cellWidth, breadcrumb.y * this.cellWidth, this.cellWidth, this.cellWidth);
        }
    }

    static drawShortestPath(shortestPath){
        for(let i = 0; i < shortestPath.length -1; i++){
            this.ctx.drawImage(this.shakingFoodBowlImg, shortestPath[i][1] * this.cellWidth, shortestPath[i][0] * this.cellWidth, this.cellWidth, this.cellWidth);
        }
    }

    static drawHint(cell){
        this.ctx.drawImage(this.catNoseImg, cell[1] * this.cellWidth, cell[0] * this.cellWidth, this.cellWidth, this.cellWidth);
    }


    static async getImage(url){
        let img = new Image();
        img.src = url;
        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img);
            };
        });
    }

    static async setImages(){
        this.oreoImg = await this.getImage('./images/Oreo.png');
        this.foodBowlImg = await this.getImage('/images/foodBowl.png');
        this.pawPrintsImg = await this.getImage('./images/pawPrint.png');
        this.catNoseImg = await this.getImage('./images/catNose.png');
        this.shakingFoodBowlImg = await this.getImage('./images/shakingFoodBowl.png');
        this.bgImg = await this.getImage('./images/bg.png');
    }
}