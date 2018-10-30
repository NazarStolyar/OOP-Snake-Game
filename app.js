var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

var blockSize = 10;
var widthInBlock = width / blockSize;
var heightInBlock = height / blockSize;

var score = 0;


// малюжм межі ігрового поля;
var drawBorder = function () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

var drawScore = function () {
  ctx.font = '20px Courier';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText("Score: " + score, blockSize, blockSize);
};

var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
};

var circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
      ctx.fill();
  } else {
      ctx.stroke();
  }
};

var Block = function (col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  var centerX = this.col * blockSize + blockSize / 2;
  var centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

//Вказуєм щоб яблуко і змія не появлялись в одній позиції
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

var Snake = function () {
  this.segment = [
      new Block(5 ,7),
      new Block(6, 5),
      new Block(5, 5)
  ];
    this.direction = "right";
    this.nextDirection = "right";
};

Snake.prototype.Draw = function () {
  for (var i = 0; i < this.segment.length; i++) {
      this.segment[i].drawSquare("Blue");
  }
};

Snake.prototype.Move = function () {
  var head = this.segment[0];
  var newHead;

  this.direction = this.nextDirection;

  if (this.direction === "right") {
      newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
      newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
      newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
      newHead = new Block(head.col, head.row - 1)
  }

  if (this.checkCollision(newHead)) {
      gameOver();
      return;
  }

  this.segment.unshift(newHead);

  if (newHead.equal(apple.position)) {
      score++;
      apple.move();
  } else {
      this.segment.pop();
  }
};

//Провіряєм чи нова голова змії не зіткнулась з стіною чи з сама з собою
Snake.prototype.checkCollision = function (head) {
    // перевіряєм чи не зіткуналась змійка з сітами ігрового поля
  var leftColision = (head.col === 0);
  var topColision = (head.row === 0);
  var rightColision = (head.col === widthInBlock - 1);
  var bottomColision = (head.row === heightInBlock - 1);
  
  var wallColision = leftColision || topColision || rightColision || bottomColision;
  
    // перевіряєм чи не зіткнуласт змія з собою
  var selfCollision = false;

  for (var i = 0; i < this.segment.length; i++) {
      if (head.equal(this.segment[i])) {
          selfCollision = true;
      }
  }
  
  return wallColision || selfCollision;
  
};

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }
    this.nextDirection = newDirection;
    
};

var Apple = function () {
  this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function () {
  var randomCol = Math.floor(Math.random() * (widthInBlock - 2)) + 1;
  var randomRow = Math.floor(Math.random() * (heightInBlock - 2)) + 1;

  this.position = new Block(randomCol, randomRow);
};

var snake = new Snake();
var apple = new Apple();

var intervalId = setInterval(function () {
    ctx.clearRect(0,0,width,height);
    drawScore();
    snake.Move();
    snake.Draw();
    apple.draw();
    drawBorder();
}, 100);

var direction = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

$('body').keydown(function (event) {
   var newDirection = direction[event.keyCode];
   if (newDirection !== undefined) {
       snake.setDirection(newDirection);
   }
});



