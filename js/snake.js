var canvas = document.getElementById("canvas"); //Canvas
var ctx = canvas.getContext("2d"); //Canvas

const w = canvas.width; //largura do jogo
const h = canvas.height; //altura do jogo
var cw = 50 //tamanho dos quadrados

var direction = "right"; //direção padrão
var snake_action = direction;
var score = 0;

var food = [];
var snake_array = [];

//Tipos de colisão
const collisionTypes = {
    NONE: 0,
    WALL: 1,
    SNAKE: 2,
    FOOD: 3
}

//EntryPoint
function init() {
    direction = "right";
    snake_action = direction;
    score = 0;
    snake_array = [];
    create_snake();
    create_food();
    draw_map()

    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(move_snake, 200);

    document.addEventListener("keydown", function(e){
        var key = e.which;
        if(key == "37" && snake_action != "right") direction = "left";
        else if(key == "38" && snake_action != "down") direction = "up";
        else if(key == "39" && snake_action != "left") direction = "right";
        else if(key == "40" && snake_action != "up") direction = "down";
    }
    );
};

function draw_map(){
    ctx.fillStyle = "white"; //interior do quadrado
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black"; //borda
    ctx.strokeRect(0, 0, w, h);

    for (var y = 0; y < h; y += cw) { //desenha linhas horizontais
        for (var x = 0; x < w; x += cw) { //desenha linhas verticais
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, cw, cw);
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, cw, cw);
        }
    }
}

//#region Funções auxiliares

//Pinta ou desenha um quadrado
function draw_cell(x, y, fillColor = "black", strokeStyle = "white"){
    ctx.fillStyle = fillColor;
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = strokeStyle;
    ctx.strokeRect(x*cw, y*cw, cw, cw);
}

//Verifica se houve colisão
function check_collision(x, y, array){
    for(var i = 0; i < array.length; i++){
        if(array[i].x == x && array[i].y == y)
            return true;
    }
    return false;
}

//Retorna qual tipo de colisão ocorreu
function check_collision_type(x, y, array){
    if (x < 0 || x >= w/cw || y < 0 || y >= h/cw) {
        return collisionTypes.WALL;
    } else if (check_collision(x, y, array)) {
        return collisionTypes.SNAKE;
    } else if (x == food.x && y == food.y) {
        return collisionTypes.FOOD;
    } else {
        return collisionTypes.NONE;
    }
}

//#endregion

function create_snake(){
    var length = 5; //tamanho padrão da cobra
    for(var i = length-1; i>=0; i--){
        snake_array.push({x: i, y:0});
    }

    //draw_snake();
}

function draw_snake(){
    for(var i = 0; i < snake_array.length; i++){
        var c = snake_array[i];
        if (i == 0) {
            draw_cell(c.x, c.y, "yellow", "black");
        } else {
            draw_cell(c.x, c.y, "green", "black");
        }
    }
}



function create_food(){
    food = {
        x: Math.round(Math.random()*(w-cw)/cw),
        y: Math.round(Math.random()*(h-cw)/cw)
    }

    //Caso a comida seja criada em cima da cobra, cria novamente
    if (check_collision(food.x, food.y, snake_array)) {
        create_food();
    }

    //draw_food();
}

function draw_food(){
    draw_cell(food.x, food.y, "red", "black");
}



function move_snake(){
    var hx = snake_array[0].x;
    var hy = snake_array[0].y;

    snake_action = direction;

    if(direction == "right") hx++;
    else if(direction == "left") hx--;
    else if(direction == "up") hy--;
    else if(direction == "down") hy++;

    var collisionType = check_collision_type(hx, hy, snake_array);

    if (collisionType == collisionTypes.WALL || collisionType == collisionTypes.SNAKE) {
        alert("Game Over");
        init();
        return;
    }

    if (collisionType == collisionTypes.FOOD) {
        var tail = {x: hx, y: hy};
        score++;
        create_food();
    }
    else {
        var tail = snake_array.pop();
        tail.x = hx;
        tail.y = hy;

        draw_cell(tail.x, tail.y, "black", "black");
    }
    snake_array.unshift(tail);

    draw_map();
    draw_food();
    draw_snake();

    var score_text = "Score: " + score;
    ctx.fillStyle = "orange";
    ctx.fillText(score_text, 5, h-5);
}


init()