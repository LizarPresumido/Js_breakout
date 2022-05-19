
class Ball{
    
    constructor(position){
    
        this.radius = 10;
        this.position = position;
        this.position.y -= this.radius;
        this.inGame = false;
        this.baseDir = {x:1,y:1};
        this.direction = {x:1,y:1};
        this.velocity = 300;
        this.lastHit = "";

    }

    Start(){

    }

    Update(deltaTime){
        if(this.inGame)
            this.Move(deltaTime);
        else
            this.StaticMovement();
    }

    Draw(ctx){
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        if(!this.inGame)
            ctx.arc(player.pos.x + player.width / 2 ,player.pos.y - this.radius,this.radius,0,PI2,false);
        else
            ctx.arc(this.position.x,this.position.y,this.radius,0,PI2,false);
        ctx.closePath();
        ctx.fill();
    }

    Move(deltaTime){
        //x move
        this.position.x += Math.cos(Math.atan2(this.direction.y, this.direction.x)) * this.velocity * deltaTime;
        if(this.position.x + this.radius > canvas.width || this.position.x - this.radius < 0){
            if(this.lastHit != "canvasx"){
                this.direction.x *= -1;
                this.lastHit = "canvasx";
            }
        }
        //y move
        this.position.y -= Math.sin(Math.atan2(this.direction.y, this.direction.x)) * this.velocity * deltaTime;
        if(this.position.y - this.radius < 0){
            if(this.lastHit != "canvasy"){
                this.direction.y *= -1;
                this.lastHit = "canvasy";
            }
        }
        else if(((this.position.y + this.radius > player.pos.y) && (this.position.x >= player.pos.x && this.position.x <= player.pos.x + player.width))){
            if(this.lastHit != "player"){
                this.direction.y *= -1;
                this.lastHit = "player";
            }
        }else if(this.position.y + this.radius > player.pos.y + player.height)
                this.Reset();

    }

    StaticMovement(){
        this.position.x = player.pos.x + player.width / 2;
        this.position.y = player.pos.y - this.radius;
    }

    Reset(){
        --vidas;
        this.lastHit = "player";
        this.inGame = false;
        this.direction.x = this.baseDir.x;
        this.direction.y = this.baseDir.y;
        this.position.x = player.pos.x + player.width / 2;
        this.position.y = player.pos.y - this.radius;
        if(vidas == 0){
            textos.EndGame();
        }
    }

    ClearLvl(){
        ball.velocity += 20;
        player.velocity += 10;
        this.inGame = false;
        this.direction.x = this.baseDir.x;
        this.direction.y = this.baseDir.y;
        this.position.x = player.pos.x + player.width / 2;
        this.position.y = player.pos.y - this.radius;
    }
}