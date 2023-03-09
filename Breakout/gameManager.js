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
        this.ALL_BALLS_RADIUS = 0.05;
        this.DEFUALT_BALL_SPEED = 0.1;
        this.PLAYER_MOVEMENT_SPEED = 0.3;
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

        this.paddle = new Paddle(0.15, 0.03, {x: 0.5, y: 1});

        let startBall = new Ball({x: 0.5, y:1 - this.paddle.height}, this.getNiceDirection(), this.DEFUALT_BALL_SPEED);
        this.balls.push(startBall);

        this.livesLeft = 3;
        this.score = 0;


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

    static getNiceDirection(){
        let range = 120 - 60;
        let angle = (Math.random() * range) + 45;
        angle *= -1;
        angle *= (Math.PI / 180);
        return {x: Math.cos(angle), y: Math.sin(angle)};
    }

    static Tick(elapsedTime){
        for(let ball of this.balls){
            ball.location.x += (ball.direction.x * ball.speed) / elapsedTime;
            ball.location.y += (ball.direction.y * ball.speed) / elapsedTime;
        }
    }
}