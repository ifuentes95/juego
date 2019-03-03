$(document).ready(function(){
    $("#objetive").hide();
    $("#winner").hide();
    $("#loser").hide();
    $("#playGmeBtn").click(function(){
        $("#caja").hide();
        $("#objetive").show();
		$("#canvas").show();
        var checkval = $("input:radio:checked").val();
        if(checkval=="easy"){
            startGame(5, 200);
        }
        else if(checkval=="medium"){
            startGame(15, 120);
            }
        else{
            startGame(20, 60);
        };
    });
    function startGame(lenth, modeValue){
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var cw = 15;
    var dir;
    var food1;
    let objsindex = 0;
    var food2;
    var food3;
    let objetivos = ['red','blue','yellow','magenta','cyan']
    let col;
    let displaynivel;
    let levelcount = 1;
    let bodycolor = "gray";
    var lengthSnake = lenth;
    var modePlay = modeValue;
    var snake_array;
    
    
    // Objetivo inicial
    $("#objetivo").css('background-color', objetivos[objsindex]); 
    function init()
    {
        dir = "right"; //dirección por defecto
        create_cobra(); //función crear serpiente
        eatfood(); // comida
        //Mover la serpiente con el tiempo -> dispara el paint
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, modePlay);
    }
    init();
    //teclas para controlar la serpiente
    $(document).keydown(function(e){
        var key = e.which;
        if(key == "37" && dir != "right") dir = "left";
        else if(key == "38" && dir != "down") dir = "up";
        else if(key == "39" && dir != "left") dir = "right";
        else if(key == "40" && dir != "up") dir = "down";
    })
    function create_cobra()
    {
        var snakeLength = lengthSnake; //largo de la serpiente
        snake_array = []; 
        for(var i = snakeLength-1; i>=0; i--)
        {
            snake_array.push({x: i, y:0}); //Crea la sepiente horizontal en la esquina superior izquierda
        }
    }
    //Pintar el nivel
    $("#level").text("Nivel 1");
    //dibujar la comida
    function eatfood()
    {
        food1 = {
            x: Math.round(Math.random()*(w-cw)/cw), 
            y: Math.round(Math.random()*(h-cw)/cw), 
        },
        food2 = {
            x: Math.round(Math.random()*(w-cw)/cw), 
            y: Math.round(Math.random()*(h-cw)/cw), 
        },
        food3 = {
            x: Math.round(Math.random()*(w-cw)/cw), 
            y: Math.round(Math.random()*(h-cw)/cw), 
        };
    }
    //Dibujar la serpiente
    function paint()
    {
        //Para que la serpiente no deje rastro
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.strokeStyle = 'black';
        ctx.lineWidth=2;
        //ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeRect(0, 0, w, h);
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //Esta era la posición de la cabeza
        //Lo incrementamos y obtenemos la nueva posición

        if(dir == "right") nx++;
        else if(dir == "left") nx--;
        else if(dir == "up") ny--;
        else if(dir == "down") ny++;

        //El juego acaba si la serpiente choca contra paredes o si misma
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
        {
            endGame();
        }
        //Código para serpiente comiendo
        //si la cabeza coincide con la comida (posición)
        //creamos nueva cabeza
        
        if(nx == food1.x && ny == food1.y)
        {
            var tail = {x: nx, y: ny};
            snake_array.push({x: X=1});
            eatfood();
            col = "blue";
            paint_cell(col);
            combinaciones(col);
        }
        else if(nx == food2.x && ny == food2.y)
        {
            var tail = {x: nx, y: ny};
            snake_array.push({x: X=1});
            eatfood();
            col = "green";
            paint_cell(col);
            combinaciones(col);
        }
        else if(nx == food3.x && ny == food3.y)
        {
            var tail = {x: nx, y: ny};
            snake_array.push({x: X=1});
            eatfood();
            col = "red";
            paint_cell(col);
            combinaciones(col);
        }
        else
        {
            var tail = snake_array.pop(); 
            tail.x = nx; tail.y = ny;
        }

        //Combinaciones que forman el color de la serpiente
        function combinaciones(col)
        {
            if(col =="green"){
                switch(bodycolor){
                    case "red":
                    bodycolor = "yellow";
                    break;
                    case "blue":
                    bodycolor = "cyan";
                    break;
                    default:
                    bodycolor = col;
                }
            }
            else if (col =="blue"){
                switch(bodycolor){
                    case "green":
                    bodycolor = "cyan";
                    break;
                    case "red":
                    bodycolor = "magenta";
                    break;
                    default:
                    bodycolor = col;
                }
            }
            else{
                switch(bodycolor){
                    case "green":
                    bodycolor = "yellow";
                    break;
                    case "blue":
                    bodycolor = "magenta";
                    break;
                    default:
                    bodycolor = col;
                }
            }
            //codigo para objetivos cumplidos y paso de nivel
            if(bodycolor == objetivos[objsindex]){
                objsindex++
                levelcount++
                $("#objetivo").css('background-color', objetivos[objsindex]);
                displaynivel = "Nivel " + levelcount;
                console.log(displaynivel);
                $("#level").text(displaynivel.toString());
                    if(levelcount > "5"){
                        $("#level").hide();
                        $("#winner").show();
                        $("#winner").animate({
                            fontSize: '+=50%'
                            },500);
                        clearInterval(game_loop);
                    }
            }
                
            
        }


        snake_array.unshift(tail); 
        for(var i = 0; i < snake_array.length; i++)
        {
            var c = snake_array[i];
            //celdas de 10px de ancho
            paint_cell(c.x, c.y, bodycolor);
        }
        //Dibujar comida y redibujarla cada vez que se come una
        paint_colorfood1(food1.x, food1.y);
        paint_colorfood2(food2.x, food2.y);
        paint_colorfood3(food3.x, food3.y);
          }
    //pintar cada una de las comidas de un color primario
    function paint_colorfood1(x, y)
    {
        ctx.fillStyle = "blue";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "blue";
        ctx.strokeRect(x*cw, y*cw, cw, cw);

        
    }
    function paint_colorfood2(x, y)
    {
        ctx.fillStyle = "green";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "green";
        ctx.strokeRect(x*cw, y*cw, cw, cw);

    }
    function paint_colorfood3(x, y)
    {
        ctx.fillStyle = "red";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "red";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }
    

    //Crear celdas
    function paint_cell(x, y, col)
    {
        ctx.fillStyle = col;
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = col;
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }
    function check_collision(x, y, array)
    {
        //Comprobamos que las coordenadas existen
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
            return true;
        }
        return false;
    }
    //funcion que termina el juego
    function endGame(){
        clearInterval(game_loop);
        $("#loser").show();
        $("#loser").animate({
            fontSize: '+=50%'
            },500);
        $("#level").hide();
        
}
}
});