//Written by Ryan Andersen A02288683 for CS5410
import { GameManager, Ball, Paddle } from "./gameManager.js";

export class Renderer {
    static {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById("canvas");
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");

        this.BRICK_YELLOW = "rgb(255, 249, 130)";
        this.BRICK_ORANGE = "rgb(255, 211, 130)";
        this.BRICK_BLUE = "rgb(130, 232, 255)";
        this.BRICK_GREEN = "rgb(130, 255, 170)";

        this.BRICK_COLOR_MAP = [
            this.BRICK_YELLOW, this.BRICK_YELLOW, 
            this.BRICK_ORANGE, this.BRICK_ORANGE, 
            this.BRICK_BLUE, this.BRICK_BLUE,
            this.BRICK_GREEN, this.BRICK_GREEN
        ];

        this.SONG_BPM = 60;
        this.SONG_BPS = this.SONG_BPM / 60;
        
        this.setImages();

        this.PADDLE_COLOR_LIST = ["rgb(0, 0, 0)", "rgb(100, 100, 100)"];
        this.paddleColorIndex = 0;
        this.timePassedSinceLastColorChanged = 0;
    }
    
    static drawGame(timeElapsed){
        if(this.bgImg){
            this.clear();
    
            this.ctx.drawImage(this.bgImg, 0, 0, this.canvas.width, this.canvas.height);
    
            // this.ctx.fillStyle = "rgb(200, 200, 200)";
            // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
            this.drawLives();
            this.drawBricks(GameManager.bricks);
            this.drawPaddle(GameManager.paddle, timeElapsed);
            this.drawBalls(GameManager.balls);
            this.drawTimer();
            this.drawScore();
        }
    }

    static clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static drawLives(){
        let width = GameManager.ALL_BALLS_DIAMETER * this.canvas.width;
        let height = GameManager.ALL_BALLS_DIAMETER * this.canvas.height;
        let startX = GameManager.BRICK_MARGIN * 3 * this.canvas.width;
        for(let i = 0; i < GameManager.livesLeft; i++){
            this.ctx.drawImage(this.nyanCatImg, startX + GameManager.BRICK_MARGIN * this.canvas.width + (width * i), 0.9 * this.canvas.height, width, height);
        }
    }

    static drawBricks(bricks){
        let brickWidth = GameManager.BRICK_WIDTH * this.canvas.width;
        let brickHeight = GameManager.BRICK_HEIGHT * this.canvas.height;

        for(let i = 0; i < bricks.length; i++){
            this.ctx.fillStyle = this.BRICK_COLOR_MAP[bricks.length - 1 - i];
            for(let brick of bricks[i]){
                this.ctx.fillRect(brick.topLeft.x * this.canvas.width, brick.topLeft.y * this.canvas.height, brickWidth, brickHeight);
            }
        }
    }

    /**
     * 
     * @param {Paddle} paddle 
     */
    static drawPaddle(paddle, timeElapsed){
        let width = paddle.width * this.canvas.width;
        let height = paddle.height * this.canvas.height;
        let locX = paddle.location.x * this.canvas.width;
        let locY = paddle.location.y * this.canvas.height;
        try{
            // this.ctx.drawImage(this.oreoImg, locX, locY, width, height);
            if((this.timePassedSinceLastColorChanged / 1000 ) >= this.SONG_BPS){
                if(this.paddleColorIndex < this.PADDLE_COLOR_LIST.length - 1){
                    this.paddleColorIndex++;
                }
                else{
                    this.paddleColorIndex = 0;
                }
                this.timePassedSinceLastColorChanged = 0;
            }
            this.ctx.fillStyle = `${this.PADDLE_COLOR_LIST[this.paddleColorIndex]}`;
            this.ctx.fillRect(locX, locY, width, height);
            this.timePassedSinceLastColorChanged += timeElapsed;
            // this.ctx.fillStyle = "rgb(255, 255, 0)";
            // let borderWidth = 5;
            // let halfBorderWidth = borderWidth / 2;
            // this.ctx.fillRect(locX + halfBorderWidth, locY + halfBorderWidth, width - borderWidth, height - borderWidth);
        }
        catch(err){
            console.log(`Paddle image note loaded: ${err}`);
        }
    }

    /**
     * 
     * @param {Array<Ball>} balls 
     */
    static drawBalls(balls){
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        for(let ball of balls){
            let locX = ball.location.x * this.canvas.width;
            let locY = ball.location.y * this.canvas.height;
            let width = GameManager.ALL_BALLS_DIAMETER * this.canvas.width;
            let height = GameManager.ALL_BALLS_DIAMETER * this.canvas.height;

            try{
                this.ctx.drawImage(this.nyanCatImg, locX, locY, width, height);
                // this.ctx.fillRect(locX, locY, width, height);
            }
            catch(err){
                console.log(`image not loaded: ${err}`);
            }
        }
    }

    static drawTimer(){
        if(GameManager.countDownTimer <= 1000){
            this.drawText("3");
        }
        else if (GameManager.countDownTimer <= 2000){
            this.drawText("2");
        }
        else if (GameManager.countDownTimer <= 3000){
            this.drawText("1");
        }
    }

    static drawText(t){
        this.ctx.fillStyle = "rgb(20, 20, 20)";
        this.ctx.font = ("100px sans-serif")
        this.ctx.fillText(t, (this.canvas.width / 2) - 18, (this.canvas.height / 2));

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = ("90px sans-serif")
        this.ctx.fillText(t, (this.canvas.width / 2) - 22.5, (this.canvas.height / 2) - 10);
    }

    static drawScore(){
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${GameManager.score}`, this.canvas.width * 0.835, this.canvas.height * 0.945);

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${GameManager.score}`, this.canvas.width * 0.83, this.canvas.height * 0.94);
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
        this.nyanCatImg = await this.getImage('./images/nyanCat.png');
        this.bgImg = await this.getImage('./images/bg.jpg');
    }
}