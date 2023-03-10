export class Ball{
    constructor(location, direction, speed){
        this.location = location;
        this.direction = direction;
        this.speed = speed;
        this.numBricksRemoved = 0;
        this.speedIncrement = 0.5;
        this.pointSteps = [4, 12, 36, 62];
    }

    incrementBricksRemoved(){
        this.numBricksRemoved++;
        if(this.pointSteps.includes(this.numBricksRemoved)){
            this.speed += this.speedIncrement;
        }
    }
}

export class Paddle{
    constructor(width, height, location){
        this.width = width;
        this.height = height;
        this.location = location;
    }
}

export class Brick{
    constructor(topLeft, topRight, bottomLeft, bottomRight, pointValue){
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
        this.pointValue = pointValue;
    }
}

export class GameManager{

    static{
        this.BRICK_POINT_MAP = {0:1, 1:1, 2:2, 3:2, 4:3, 5:3, 6:5, 7:5};
        this.ALL_BALLS_DIAMETER = 0.05;
        this.DEFUALT_BALL_SPEED = 0.1;
        this.PLAYER_MOVEMENT_SPEED = 0.20;
        this.NUM_BRICKS_IN_A_ROW = 14;
        this.NUM_BRICK_ROWS = 8;
        this.BRICK_MARGIN = .005;
        this.BRICK_WIDTH = (1.0 - ((this.NUM_BRICKS_IN_A_ROW + 1) * this.BRICK_MARGIN))/this.NUM_BRICKS_IN_A_ROW;
        this.BRICK_HEIGHT = 0.028;
        this.BRICK_DISTANCE_FROM_TOP = 0.2;

        this.setDefaultState();
    }

    static setDefaultState(){

        this.fillBricks();
        /**
         *  @type {Array<Ball>}
         */
        this.balls = [];

        this.numBricks = 14;

        this.paddle = new Paddle(0.15, 0.03, {x: 0.5 - (0.15/2), y: 1 - 0.03});

        let startBall = new Ball({x: 0.5 - this.ALL_BALLS_DIAMETER /2, y: 1 - this.paddle.height - this.ALL_BALLS_DIAMETER - 0.001}, this.getNiceDirection(true), this.DEFUALT_BALL_SPEED);
        this.balls.push(startBall);

        this.livesLeft = 3;
        this.score = 0;

        this.inMenu = false;
    }

    static fillBricks(){
        this.bricks = [];
        let startX = this.BRICK_MARGIN;
        let startY = this.BRICK_DISTANCE_FROM_TOP;
        for(let i = this.NUM_BRICK_ROWS - 1; i >= 0; i--){
            let brickList = [];
            for(let j = 0; j < this.NUM_BRICKS_IN_A_ROW; j++){
                let brick = new Brick(
                    {x: startX, y: startY}, 
                    {x: startX + this.BRICK_WIDTH, y: startY},
                    {x: startX, y: startY + this.BRICK_HEIGHT},
                    {x: startX + this.BRICK_WIDTH, y: startY + this.BRICK_HEIGHT},
                    this.BRICK_POINT_MAP[i]
                );
                brickList.push(brick);
                startX += this.BRICK_WIDTH + this.BRICK_MARGIN;
            }
            startX = this.BRICK_MARGIN;
            startY += this.BRICK_HEIGHT + this.BRICK_MARGIN;
            this.bricks.push(brickList);
        }
        console.log(this.bricks);
    }

    static getNiceDirection(up){
        let range = 120 - 60;
        let angle = (Math.random() * range) + 45;

        angle *= up ? -1 : 1;
        angle *= (Math.PI / 180);
        return {x: Math.cos(angle), y: Math.sin(angle)};
    }

    static tick(elapsedTime){
        if(!this.inMenu){
            let collisions = this.detectCollisions();
            this.moveBalls(elapsedTime, collisions);
            this.clearBricks(collisions);
        }
    }

    static detectCollisions(){
        let collisions = [];
        for(let b = 0; b < this.balls.length; b++){
            let ball = this.balls[b];
            for(let i = 0; i < this.bricks.length; i++){
                for(let j = 0; j < this.bricks[i].length; j++){
                    if(this.checkIfPointInBrick(ball.location, this.bricks[i][j])){
                        collisions.push({type: "brick", brickIndex: {row: i, column: j}, ballIndex: b, fromDirection: "bottom"});
                    }
                    else if(this.checkIfPointInBrick({x: ball.location.x + this.ALL_BALLS_DIAMETER, y: ball.location.y + this.ALL_BALLS_DIAMETER}, this.bricks[i][j])){
                        collisions.push({type: "brick", brickIndex: {row: i, column: j}, ballIndex: b, fromDirection: "top"});
                    }
                }
            }
            if(this.checkIfPointInPaddle({x: ball.location.x + this.ALL_BALLS_DIAMETER, y: ball.location.y + this.ALL_BALLS_DIAMETER})
            || this.checkIfPointInPaddle({x: ball.location.x, y: ball.location.y + this.ALL_BALLS_DIAMETER})){
                collisions.push({type: "paddle", ballIndex: b});
            }
            if(ball.location.x <= 0){
                collisions.push({type: "wall", ballIndex: b, wall: "left"});
            }
            if(ball.location.x + this.ALL_BALLS_DIAMETER >= 1){
                collisions.push({type: "wall", ballIndex: b, wall: "right"});
            }
            if(ball.location.y <= 0){
                collisions.push({type: "wall", ballIndex: b, wall: "top"});
            }
            if(ball.location.y >= 1){
                collisions.push({type: "wall", ballIndex: b, wall: "bottom"});
            }
        }
        return collisions;
    }

    static moveBalls(elapsedTime, collisions){
        if(collisions.length > 0){
            console.log(`collisions: ${JSON.stringify(collisions)}`);
            for(let collision of collisions){
                if(collision.type == "brick"){
                    this.balls[collision.ballIndex].direction = collision.fromDirection == "bottom" ? this.getReflectionVector(this.balls[collision.ballIndex].direction, {x: 0, y: -1}) :  this.getReflectionVector(this.balls[collision.ballIndex].direction, {x:0, y:1});
                    console.log(`ball: ${JSON.stringify(this.balls[collision.ballIndex])}`);
                }
                else if (collision.type == "paddle"){
                    this.balls[collision.ballIndex].direction = this.getReflectionVector(this.balls[collision.ballIndex].direction, {x:0, y:1});
                }
                else if (collision.type == "wall"){
                    let normal = {x: 1, y:0};
                    if(collision.wall == "right"){
                        normal = {x: -1, y:0};
                    }
                    else if(collision.wall == "top"){
                        normal = {x: 0, y: -1};
                    }
                    else if(collision.wall == "bottom"){
                        this.setDefaultState();
                        return;
                    }
                    this.balls[collision.ballIndex].direction = this.getReflectionVector(this.balls[collision.ballIndex].direction, normal);
                }
            }
        }
        for(let ball of this.balls){
            ball.location.x += (ball.direction.x * ball.speed) / elapsedTime;
            ball.location.y += (ball.direction.y * ball.speed) / elapsedTime;
        }
    }

    /**
     * 
     * @param {*} point 
     * @param {Brick} brick 
     */
    static checkIfPointInBrick(point, brick){
        if(point.x >= brick.topLeft.x && point.x <= brick.topRight.x){
            if(point.y <= brick.bottomLeft.y && point.y >= brick.topLeft.y){
                return true;
            }
        }
        return false;
    }

    static checkIfPointInPaddle(point){
        if(point.x >= this.paddle.location.x && point.x <= this.paddle.location.x + this.paddle.width){
            if(point.y >= this.paddle.location.y && point.y < 1){
                return true;
            }
        }
        return false;
    }

    static getReflectionVector(direction, normal){
        let c = 2 * this.getDot(direction, normal);
        normal.x *= c;
        normal.y *= c;
        return {x: direction.x - normal.x, y: direction.y - normal.y};
    }

    static getDot(a, b){
        return (a.x * b.x) + (a.y * b.y);
    }

    static clearBricks(collisions){
        for(let collision of collisions){
            if(collision.type == "brick"){
                try{
                    this.bricks[collision.brickIndex.row].splice(collision.brickIndex.column, 1);
                }
                catch(err){
                    console.log(`failed to remove brick: ${err}`);
                }
            }
        }
    }
}