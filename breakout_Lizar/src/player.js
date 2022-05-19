
var player = {
    pos: {x:0,y:0},
    velocity: 250,
    width: 100,
    height: 20,

    Start: function (){
        this.pos.x = canvas.width / 2 - this.width / 2;
        this.pos.y = canvas.height - this.height / 2 - 50;
    },
    Update: function(deltaTime){
        if(Input.IsKeyPressed(KEY_LEFT))
            this.pos.x -= this.velocity * deltaTime;

        if(Input.IsKeyPressed(KEY_RIGHT))
            this.pos.x += this.velocity * deltaTime;

            //this.pos.x = (this.pos.x < 0) ? 0 : ((this.pos.x + this.width) > canvas.width) ? canvas.width - this.width : this.pos.x;

            if(this.pos.x < 0) //left cap
                this.pos.x = 0;
            else if((this.pos.x + this.width) > canvas.width) //right cap
                this.pos.x = canvas.width - this.width;
    },
    Draw: function(ctx){
        ctx.fillStyle = "lightgray";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}