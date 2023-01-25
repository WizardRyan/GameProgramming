//Written by Ryan Andersen A02288683 for CS5410 1/18/2023

const addEventButton = document.getElementById("add-event-button");
const outputPanel = document.getElementById("output-panel");
const nameInput = document.getElementById("name");
const intervalInput = document.getElementById("interval");
const numTimes = document.getElementById("num-times");

let prevTime = performance.now();

//start game loop
requestAnimationFrame(gameLoop);

//This class doesn't do anything useful other than be an event for a game loop, for demonstration purposes
class CustEvent {
    constructor(name, interval, numTimes){
        this.name = name;
        this.interval = interval;
        this.numTimes = numTimes;
        this.accumulatedTime = 0;
        this.readyToRemove = false;
    }
}

let customEvents = [];
let eventsToRender = [];

function addEvent(event){
    customEvents.push(getEventInfo());
}

function getEventInfo(){
    let customEvent = new CustEvent(nameInput.value, Number(intervalInput.value), Number(numTimes.value));
    nameInput.value = "";
    intervalInput.value = "";
    numTimes.value = "";
    return customEvent;
}

function gameLoop(timeStamp){
    let elapsedTime = timeStamp - prevTime;
    prevTime = timeStamp;
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
}

function render(){
    for(let i = 0; i < eventsToRender.length; i++){
        outputPanel.innerHTML += `<span>Event: ${eventsToRender[i].name} (${eventsToRender[i].numTimes} remaining)</span>`;
        outputPanel.scrollTo(0, outputPanel.scrollHeight);
    }
    eventsToRender = [];
}

function update(elapsedTime){
    for(let i = 0; i < customEvents.length; i++){
        customEvents[i].accumulatedTime += elapsedTime;
        if(customEvents[i].accumulatedTime >= customEvents[i].interval){
            eventsToRender.push(customEvents[i]);
            customEvents[i].numTimes--;
            if(customEvents[i].numTimes <= 0){
                customEvents[i].readyToRemove = true;
            }
            else{
                customEvents[i].accumulatedTime = 0;
            }
        }
    }
    customEvents = customEvents.filter(customEvent => !customEvent.readyToRemove);
}
