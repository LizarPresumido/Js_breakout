
var canvas;
var ctx;

var targetDeltaTime = 1 / 60;
var currentDeltaTime = 0;
var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0,
    puntuacion = 0;
var timeSinceBegining = 0;

var ball = null;
var lvlNumber = 1;

const VIDAS_MAX = 3;
const COLUMNS = 5;
const ROWS = 3;
const COLOURS = ["red","blue","green","brown","lightgray","magenta","pink"];

var opacity = 0.4;

var textos = {
    texto: "",
    color: "white",
    font: "24px Comic Sans MS regular",
    position: {
        x: 30,
        y: 200
    },
    canDraw: true,
    Inicio: function(){
        this.texto =  "Pulsa espacio para comenzar la partida";
    },
    EndGame: function(){
        this.canDraw = true;
        this.texto = "Pulsa intro para reiniciar la partida";
    }
}

var bricks = [];
var brickNumber;

var vidas;
var myImg;

window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame ||
    	window.mozRequestAnimationFrame    ||
    	window.webkitRequestAnimationFrame ||
    	window.msRequestAnimationFrame     ||
    	function (callback) {
        	window.setTimeout(callback, targetDeltaTime * 1000);
    	};
}) ();

window.onload = BodyLoaded;


function BodyLoaded()
{
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

   img = new Image(canvas.width,canvas.height);
   img.src = "img/istockphoto-1140828326-612x612.jpg";
    img.Draw = function(ctx) {
        ctx.drawImage(img, 0, 0);
    };

    InitializeBricks(canvas);


    SetupKeyboardEvents();
    SetupMouseEvents();

    Start();
    Loop();
}

function Start()
{
    time = Date.now();
    vidas = VIDAS_MAX;
    textos.Inicio();

    player.Start();
    ball = new Ball({x:player.pos.x + player.width / 2, y:player.pos.y});
    ball.Start();
}

function Loop ()
{
    // prepare the next loop
    requestAnimationFrame(Loop);

    //deltaTime
    const now = Date.now();
    let deltaTime = (now - time) / 1000;
    currentDeltaTime = deltaTime;
    
    time = now;

    // frames counter
    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1;
    }
    
    if (deltaTime > 100)
        deltaTime = 100;

    // Game logic -------------------
    Update(deltaTime);

    // Draw the game ----------------
    Draw(ctx);


    Input.PostUpdate();
}

function Update(deltaTime)
{
    timeSinceBegining += deltaTime;

    player.Update(deltaTime);
    if(brickNumber == 0){
        ball.ClearLvl();
        ++lvlNumber;
        if(lvlNumber < COLOURS.length)
            InitializeBricks(canvas);   
        else
            Restart();   
    }
    bricks.forEach(brick => {
        if(brick != null)
            brick.Collision();
    });
    ball.Update(deltaTime);
}

function Draw(ctx)
{
    // background
    img.Draw(ctx);

    if(bricks.length != 0){
        bricks.forEach(brick => {
            if(brick != null){
                ctx.fillStyle = brick.Color();
                ctx.fillRect(brick.position.x, brick.position.y, brick.width,brick.height);
                ctx.globalAlpha = 0.6;
                ctx.lineWidth = "3";
                ctx.strokeStyle = "black";
                ctx.strokeRect(brick.position.x, brick.position.y, brick.width,brick.height);
                ctx.globalAlpha = 1;
            }
        });
    }
   if(textos.canDraw){
        ctx.fillStyle = textos.color;
        ctx.font = textos.font;
        ctx.fillText(textos.texto,textos.position.x,textos.position.y);
   }
    
    player.Draw(ctx);
    ball.Draw(ctx);

    // draw the frame counter
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    ctx.fillText("FPS: " + FPS, 10, 30);
    ctx.fillText("deltaTime: " + currentDeltaTime, 10, 50);
    ctx.fillText("currentFPS: " + (1/currentDeltaTime).toFixed(2), 10, 70);  
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(320,0,200,60);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "yellow";
    ctx.font = "15px Comic Sans MS regular";
    ctx.fillText("Puntuación: " + puntuacion, 340, 20);
    ctx.fillText("Vidas: "+vidas, 340, 50);
}

function Restart(){
    vidas = VIDAS_MAX;
    puntuacion = 0;
    textos.Inicio();
    InitializeBricks(canvas);
}

function InitializeBricks(canvas){
    let width = canvas.width / COLUMNS;
    let height = 100 / ROWS;
    let counter = 0;

    brickNumber = ROWS * COLUMNS;

    for(let j = 0; j < ROWS; ++j){
        for(let i = 0; i < COLUMNS; ++i){
            var type = (Math.random() * lvlNumber).toFixed(0);
            bricks[counter] = {
                index: counter,
                type: type,
                points: type * 500 + 500,
                position: 
                {
                    x: 0 + width * i,
                    y: 0 + height * j
                }, 
                width: width, 
                height: height, 
                Color: function(){
                    return COLOURS[this.type];
                },
                Collision: function(){
                    //colision lados horizontales
                    if(ball.position.y < this.position.y + height && (ball.position.x >= this.position.x && ball.position.x <= this.position.x + width)){
                        puntuacion += this.points;
                        if(this.type == 0){
                            bricks[this.index] = null;
                            --brickNumber;
                        }else 
                            --this.type;
                        ball.direction.y *= -1;
                        ball.lastHit = "brick"+this.index;
                    }else if(((ball.position.x + ball.radius > this.position.x && ball.position.x - ball.radius < this.position.x + this.width) && (ball.position.y >= this.position.y && ball.position.y <= this.position.y + this.height))){
                        puntuacion += this.points;
                        if(this.type == 0){
                            bricks[this.index] = null;
                            --brickNumber;
                        }else 
                            --this.type;
                        ball.direction.x *= -1;
                        ball.lastHit = "brick"+this.index;
                    }
                }
            };
            ++counter;
        }
    }
}