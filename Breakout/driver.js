//Written by Ryan Andersen A02288683 for CS5410
import { GameManager } from "./gameManager.js";
import { InputManager } from "./InputManager.js";
import { Renderer } from "./renderer.js";

let prevTime = performance.now();
let elapsedTime;
let timeRan = 0;
//start game loop
requestAnimationFrame(gameLoop);

function gameLoop(timeStamp){
    elapsedTime = timeStamp - prevTime;
    prevTime = timeStamp;
    update(elapsedTime);
    //elapsedTime used for rainbow effect
    render();
    requestAnimationFrame(gameLoop);
}

function render(){
    Renderer.drawGame(elapsedTime);
}

function update(elapsedTime){
    InputManager.processInputs(elapsedTime);
    GameManager.Tick(elapsedTime);
    timeRan += elapsedTime;
}