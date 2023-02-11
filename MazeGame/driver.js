//Written by Ryan Andersen A02288683 for CS5410
import { Maze, PrimCell } from "./maze.js";
import { Renderer } from "./renderer.js";

const sizeSelect = document.getElementById("sizeSelect");
const startGameBttn = document.getElementById("startGameBttn");
startGameBttn.onclick = startGame;
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const pScoresEl = document.getElementById("playerScores");
const popup = $("#myModal");

/** @type {Maze} */
let maze = undefined;

let playerLocation = {x: 0, y: 0};
let time = 0;
let breadcrumbs = [];
let showBreadCrumbs = false;
let showShortestPath = false;
let showHint = false;
let numMoves = 0;
let minPossibleMoves = 0;
let score = 100;
let beatGame = false;
let shownModal = false;

let playerScores = [];

function startGame(){
    if(maze){
        //save current stats
    }
    setCleanState();
}

function setCleanState(){
    playerLocation.x = 0;
    playerLocation.y = 0;
    time = 0;
    breadcrumbs = [];
    numMoves = 0;
    showHint = false;
    showBreadCrumbs = false;
    showShortestPath = false;
    beatGame = false;
    shownModal = false;
    score = 100;
    Renderer.clear();
    maze = new Maze(sizeSelect.value);
    minPossibleMoves = maze.shortestPath.length - 1;
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
    timeEl.innerHTML = getTime();
    scoreEl.innerHTML = score > 0 ? score.toFixed(2) : 0;
    if(Renderer.maze){
        Renderer.clear();
        Renderer.drawMaze(maze);
        if(showBreadCrumbs){
            Renderer.drawBreadCrumbs(breadcrumbs);
        }
        if(showShortestPath){
            Renderer.drawShortestPath(maze.shortestPath);
        }
        if(showHint && maze.shortestPath.length > 1){
            Renderer.drawHint(maze.shortestPath[1]);
        }
        Renderer.drawPlayer(playerLocation);

        if(beatGame && !shownModal){
            popup.modal("show");
            let s = playerScores[playerScores.length - 1];
            pScoresEl.innerHTML += `<li class="list-group-item">Score: ${s.score.toFixed(2)} Size: ${s.size} Time: ${s.time}</li>`;
            shownModal = true;
        }
    }
}

function update(elapsedTime){
    time += elapsedTime;
    if(maze){
        if(playerLocation.x == maze.mazeSize - 1 && playerLocation.y == maze.mazeSize - 1 && !beatGame){
            beatGame = true;
            playerScores.push({score, size: maze.mazeSize, time: getTime()})
        }
    }
}

function getTime(){
    return (time/1000).toFixed(2)
}

//TODO: implement a more sophisticated input system on the next project that works with the game loop. This will do for now
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
        let moved = true;
        let originalLoc = JSON.parse(JSON.stringify(playerLocation));
    
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
        else{
            moved = false;
        }

        if(moved && !coordsAreInArray({x: originalLoc.x, y: originalLoc.y}, breadcrumbs)){
            breadcrumbs.push({x: originalLoc.x, y: originalLoc.y});
        }
        
        if(moved){
            maze.solveMaze([playerLocation.y, playerLocation.x]);
            numMoves++;
            console.log(numMoves);
            if(numMoves > minPossibleMoves){
                score -= (numMoves / minPossibleMoves);
            }
        }
        
        if(controls.breadcrumbs.includes(e.key)){
            showBreadCrumbs = !showBreadCrumbs;
        }
        
        if(controls.pathToFinish.includes(e.key)){
            showShortestPath = !showShortestPath;
        }
        
        if(controls.hint.includes(e.key)){
            showHint = !showHint;
        }
    }
});

function coordsAreInArray(coords, arr){
    return arr.find(pair => pair.x == coords.x && pair.y == coords.y);
}

