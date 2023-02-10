//Written by Ryan Andersen A02288683 for CS5410
import { Maze, PrimCell } from "./maze.js";
import { Renderer } from "./renderer.js";

const sizeSelect = document.getElementById("sizeSelect");
const startGameBttn = document.getElementById("startGameBttn");
startGameBttn.onclick = startGame;
const timeEl = document.getElementById("time");

/** @type {Maze} */
let maze = undefined;

let playerLocation = {x: 0, y: 0};
let time = 0;
let breadcrumbs = [];

function startGame(){
    //save current stats
    resetState();
}

function resetState(){
    playerLocation.x = 0;
    playerLocation.y = 0;
    time = 0;
    Renderer.clear();
    maze = new Maze(sizeSelect.value);
    Renderer.drawMaze(maze);
}

let prevTime = performance.now();
//start game loop
requestAnimationFrame(gameLoop);

function gameLoop(timeStamp){
    let elapsedTime = timeStamp - prevTime;
    prevTime = timeStamp;
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
}

function render(){
    timeEl.innerHTML = (time/1000).toFixed(2);
    Renderer.drawPlayer(playerLocation);
}

function update(elapsedTime){
    time += elapsedTime;
}

//TODO: implement a more sophisticated input system on the next project that works with the game loop—this will do for now
let controls = {
    up: ["w", "i", "ArrowUp"], 
    down: ["s", "k", "ArrowDown"], 
    left: ["a", "j", "ArrowLeft"], 
    right:["d", "l", "ArrowRight"], 
    breadcrumbs: ["b"], 
    hint: ["h"], 
    pathToFinish: ["p"]
};

window.addEventListener("keyup", e => {
    if(maze){
        let cell = maze.mazeArray[playerLocation.y][playerLocation.x];
    
        if (controls.up.includes(e.key)){
            if(playerLocation.y > 0 && !cell.upWall){
                playerLocation.y--;
            }
        }
        else if (controls.down.includes(e.key)){
            if(playerLocation.y < maze.mazeSize - 1 && !cell.downWall){
                playerLocation.y++;
            }
        }
        else if(controls.right.includes(e.key)){
            if(playerLocation.x < maze.mazeSize - 1 && !cell.rightWall){
                playerLocation.x++;
            }
        }
        else if(controls.left.includes(e.key)){
            if(playerLocation.x > 0 && !cell.leftWall){
                playerLocation.x--;
            }
        }
    }
});

