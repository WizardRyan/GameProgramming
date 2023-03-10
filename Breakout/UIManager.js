let canvasEl = document.getElementById("canvas");
let mainMenuEl = document.getElementById("main-menu");
let newGameEl = document.getElementById("new-game");
let highScoresEl = document.getElementById("high-scores");
let creditsEl = document.getElementById("credits");
let pauseMenuEl = document.getElementById("pause-menu");

pauseMenuEl.style = "display: none";
canvasEl.style = "display: none;";
newGameEl.onclick = () => {
    canvasEl.style = "display: block;";
    mainMenuEl.style = "display: none;";
    inMenu = false;
}

class UIManager{
    
}