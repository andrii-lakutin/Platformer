(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


// ВВерху функция которая позволяет requestAnimationFrame работать хорошо на всех браузерах, а если не поддерживается использует setInterval.



var canvas = document.getElementById("canvas"),                         //Ищем наш Canvas
    ctx = canvas.getContext("2d"),
    img = document.getElementById("SMBmodel");
    width =  1000;
    height = 500;
var score = 0;
var scorediv = document.getElementById('score');
var brick = document.getElementById("brick");
var pat = ctx.createPattern(brick,"repeat");


    canvasofmodel = document.getElementById("canvasofmodel");                         //Ищем наш Canvas модельки, для модельки сделан отдельный канвас для 
    ctx2 = canvasofmodel.getContext('2d');                                            //оптимизации, это быстрее в 5 раз чем отрисовать картинку напрямую  
    canvasofmodel.width =  33;                                                        //https://habrahabr.ru/post/119772/ пункт 21
    canvasofmodel.height = 25;  
    ctx2.drawImage(img,0,-2);


player = {                       
      x : width/5,          // Изначальная позиция модельки по иксу и по игрику
      y : 400,
      width : 45,           //Параметры размера модельки
      height : 35,
      speed: 2,             //Максимальная Скорость модельки
      velX: 0,              //Скорость на данный момент по x и y 
      velY: 0,
      jumping : false, 
      grounded: false      // приземление

    };

keys = [];                  //Массив кнопок
gravity = 0.23; 
slowdown = 0.8;

canvas.width = width;
canvas.height = height;



var boxes = []   //Создаем пустой массив, куда будем лепить наши блоки
 

boxes.push({         //Метод push для массива добавляет элемент в конец массива и возвращает новую длинну
    x: -700,
    y: 0,
    width: 700,
    height: height
});
boxes.push({
    x: 0,
    y: height - 70,
    width: width + 1000,
    height: 150
});

boxes.push({
    x: width + 1200,
    y: height - 70,
    width: 70,
    height: 150
});

boxes.push({
    x: width + 1200+140,
    y: height - 70,
    width: 500,
    height: 150
});
boxes.push({
    x: width + 1200+140+500,
    y: 0,
    width: 800,
    height: height
});

boxes.push({
    x: 500,
    y: 270,
    width: 40,
    height: 40
});

boxes.push({
    x: 650,
    y: 270,
    width: 200,
    height: 40
});

boxes.push({
    x: 650,
    y: 170,
    width: 200,
    height: 40
});

boxes.push({
    x: 750,
    y: 70,
    width: 40,
    height: 40
});

var coins = [];
coins.push({
    x: 512,
    y: 240,
    width: 15,
    height: 15
});
coins.push({
    x: 680,
    y: 240,
    width: 15,
    height: 15
});

coins.push({
    x: 745,
    y: 240,
    width: 15,
    height: 15
});
coins.push({
    x: 815,
    y: 240,
    width: 15,
    height: 15
});
coins.push({
    x: 762,
    y: 45,
    width: 15,
    height: 15
});
coins.push({
    x: 1200,
    y: 400,
    width: 15,
    height: 15
});
coins.push({
    x: 1200,
    y: 360,
    width: 15,
    height: 15
});
coins.push({
    x: 1200,
    y: 320,
    width: 15,
    height: 15
});
coins.push({
    x: 1500,
    y: 320,
    width: 15,
    height: 15
});
coins.push({
    x: 1500,
    y: 380,
    width: 15,
    height: 15
});
coins.push({
    x: 1850,
    y: 380,
    width: 15,
    height: 15
});
coins.push({
    x: 2225,
    y: 380,
    width: 15,
    height: 15
});
coins.push({
    x: 2400,
    y: 380,
    width: 15,
    height: 15
});
coins.push({
    x: 2800,
    y: 380,
    width: 15,
    height: 15
});

var pipes = [];

pipes.push({
    x: 1000,
    y: 275,
    width: 120,
    height: 25
});
pipes.push({
    x: 1015,
    y: 275,
    width: 90,
    height: 155
});
pipes.push({
    x: 1300,
    y: 205,
    width: 120,
    height: 25
});
pipes.push({
    x: 1315,
    y: 215,
    width: 90,
    height: 215
});
pipes.push({
    x: 1600,
    y: 255,
    width: 120,
    height: 25
});
pipes.push({
    x: 1615,
    y: 255,
    width: 90,
    height: 175
});

function update(){
// Проверка кнопок
   if (keys[39]) {
       // Стрелочка вправо
       if (player.velX < player.speed) {           //Проверка: Скорость игрока меньше максимальной? если да то увеличивать скорость        
           player.velX++;    
          for (i=0; i<boxes.length; i++){                              //Сдвиг всех коробок в противоположную от движения сторону
             boxes[i].x += -player.velX*4.5;
             if (keys[16]){
                boxes[i].x += -player.velX-player.velX;                 //Для шифта ускорения движения коробок
             }
           }     
           for (i=0; i<coins.length; i++){                              //Сдвиг всех коробок в противоположную от движения сторону (coins)
             coins[i].x += -player.velX*4.5;
             if (keys[16]){
                coins[i].x += -player.velX-player.velX;                
             }
           }  
           for (i=0; i<pipes.length; i++){                              //Сдвиг всех коробок в противоположную от движения сторону (pipes)
             pipes[i].x += -player.velX*4.5;
             if (keys[16]){
                pipes[i].x += -player.velX-player.velX;                
             }
           }                  
       }          
   }     

   if (keys[37]) {                 
        // Стрелочка влево                  
       if (player.velX > -player.speed) {          //и когда скорость станет максимальной проверка не выполнится и скорость не будет возрастать
           player.velX--;
                  for (i=0; i<boxes.length; i++){
                     boxes[i].x -= player.velX*4.5;
                         if (keys[16]){
                            boxes[i].x -= player.velX+player.velX;
                         }
                     }   
                     for (i=0; i<coins.length; i++){
                    coins[i].x -= player.velX*4.5;
                         if (keys[16]){
                            coins[i].x -= player.velX+player.velX;
                         }
                     } 
                      for (i=0; i<pipes.length; i++){
                    pipes[i].x -= player.velX*4.5;
                         if (keys[16]){
                            pipes[i].x -= player.velX+player.velX;
                         }
                     } 
       }
     }


  if (keys[38] || keys[32]) {
    // Стрелочка вверх ИЛИ пробел
  if(!player.jumping && player.grounded){                             
   player.jumping = true;   
   player.grounded = false; // Мы больше не на земле!!                       
   player.velY = -player.speed*4.5;                  
  }                                                // player.velY = -player.speed*4; - задается с минусом чтобы моделька двигалась со скоростью вверх
}                                                  //Сначала проверка - мы в прыжке или нет.Если мы по нажатию клавиши начинаем прыжок => player.jumping = true;
                                                   // и задается отрицательная скорость по y - летим вверх. Добавляем значение гравитации: чем ниже значение тем
     player.velY += gravity;                       // выше улетает моделька. Гравитация тащит в сторону положительного значения по y до пола. 
     player.velX *= slowdown;                      // 
    // player.x += player.velX;                      // player.x += player.velX  тоже что и player.x = player.x + player.velX
    // player.y += player.velY;                      // Позиция = текущая позиция + скорость модельки.

/*if(player.y >= height-player.height-70){          //Проверка на то чтобы персонаж не падал сквозь пол
    player.y = height - player.height-70;         //Подробно: если позиция по y персонажа ниже нижней границы - 70 => позицию по y оставить на нижней границе-70
    player.jumping = false;                       //Прыжок прервать при ударении об нижнюю границу.
    }
    */ //УДАЛЕНО, так как вместо этого использоваться будет система проверки столкновений и это больше не нужные проверки.

                                                   
// player.velX *= slowdown - Замедление персонажа. Подробно: Скорость по х умножается на коэфициент ниже 1 и с каждым разом становится 
//меньше.

                          
                         

   if (keys[16]) {                                 //Ускоряем нашу модельку шифтом
       // Shift
       if (player.velX < player.speed) {                   
           player.x += player.velX + player.velX;               
        }          
    }    


/*if (player.x >= width-player.width) {             //Проверка на то чтобы моделька не выходила за пределы Canvas'a
    player.x = width-player.width;                //Подробно: Если позиция игрока больше размера канваса по х => остановить его на конце справа
} else if (player.x <= 0) {                       //если позиция игрока меньше 0 по х- остановить слева
    player.x = 0;
} */  // УДАЛЕНО, так как вместо этого использоваться будет система проверки столкновений и это больше не нужные проверки.

    
    ctx.clearRect(0,0,canvas.width,canvas.height);                                    //Перерисовка всего фона чтобы очистить след от передвижения модельки

    ctx.fillStyle = pat; // Цвет заполнения 
    ctx.beginPath();         //Начало пути

    player.grounded = false;  
    for (var i = 0; i < boxes.length; i++) {                     // Цикл рисующий каждый блок массива с блоками
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    var dir = colCheck(player, boxes[i]); //Проверка столкновений модельки и блоков  
    if (dir === "l" || dir === "r") {
     player.velX = 0;
     player.jumping = false;
      } else if (dir === "b") {
     player.grounded = true;
     player.jumping = false;
      } else if (dir === "t") {
     player.velY *= -1;
     }
     }

    ctx.fill();        //метод fill() заполняет текущий путь.



    ctx.fillStyle = "rgb(255,223,25)";              //Монетки
     ctx.beginPath();
    for (var i = 0; i < coins.length; i++) {                     // Цикл рисующий каждый блок массива с блоками-монеток
    ctx.rect(coins[i].x, coins[i].y, coins[i].width, coins[i].height);
    var coin = colCheck(player, coins[i]);

    if (coin === "l" || coin === "r") {
       coins[i].x = -1500;
       score += 1;

      } else if (coin === "b") {
        coins[i].x = -1500;
        score += 1;
     
      } else if (coin === "t") {
        coins[i].x = -1500;
        score += 1;
     }
     }



     ctx.fill();


    ctx.fillStyle = "rgb(145,255,34)"; // Цвет заполнения 
    ctx.beginPath();         //Начало пути
    for (var i = 0; i < pipes.length; i++) {                     // Цикл рисующий каждый блок массива с блоками
    ctx.rect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);
    var pipe = colCheck(player, pipes[i]);  

    if (pipe === "l" || pipe === "r") {
     player.velX = 0;
     player.jumping = false;
      } else if (pipe === "b") {
     player.grounded = true;
     player.jumping = false;
      } else if (pipe === "t") {
     player.velY *= -1;
     }
     }

    ctx.fill();     


    if(player.grounded){       //Если моделька на земле - не падать и не улетать.
     player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    if (player.y > 600) {
        setTimeout(function(){location.href = 'end.html';}, 1000);
    }

    ctx.drawImage(canvasofmodel,player.x, player.y, player.width, player.height);     //Рисование нашей модельки
    requestAnimationFrame(update);

    if (coin) {
        alert("GJ, Score:" + score);
        setTimeout(function(){location.href = 'end.html';}, 1000);
    }      //Счетчик очков
}

//Функция Collision Check - проверка столкновения
/*Объяснение: Папка: "Логика функции проверки столкновения"*/
function colCheck(shapeA, shapeB) {
    // Получение векторов
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // Добавляем половину ширины и половину высоты.
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;
 
    // Если вектор х и у меньше чем половина высоты или половины ширины, тогда мы должны находится внутри объекта, провоцируя столкновение.
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // Имеет значение с какой стороны мы сталкиваемся (top, bottom, left, or right)         
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);        
       if (oX >= oY) {
            if (vY > 0) {                               
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

window.addEventListener("load", function(){                 //Вызов функции отрисовки модельки игрока.
  update();
});

document.body.addEventListener("keydown", function(e) {          //Функции нажатия кнопок привязываются к body
    keys[e.keyCode] = true;                                      //Эти 2 функции позволяют удерживать/нажимать сразу несколько кнопок
});                                                              //просто отлавливая нажата кнопка или нет
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

