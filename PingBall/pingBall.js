/////CANVAS/////
var canvas            = document.getElementById("myCanvasGameArea");
var ctx               = canvas.getContext("2d");
const backGroundImage = new Image();
backGroundImage.src   = "./cliparts/backGroundImg.jpg";

const scoreImage = new Image();
scoreImage.src = "./cliparts/score.png";

const lifeImage = new Image();
lifeImage.src = "./cliparts/lives.png";

const levelImage = new Image();
levelImage.src = "./cliparts/flag.png";
/////CANVAS/////


/////////SOUNDS/////////
/*
NOTE : If sound does't work in your browser, it is because you have not enabled the
permission for Autoplay. To do that :
	- Go to settings
	- Privacy & Security
	- Permissions -> Autoplay
	- Enable it :-)
	- Refresh the game or relaunch the game to enjoy the sound as well.
*/
const WALL_BALL_HIT_SOUND = new Audio();
WALL_BALL_HIT_SOUND.src = "./sounds/paddle_wall_hit_sound.mp3";

const PADDLE_BALL_HIT_SOUND = new Audio();
PADDLE_BALL_HIT_SOUND.src = "./sounds/paddle_ball_hit_sound.mp3";

const LIFE_SOUND = new Audio();
LIFE_SOUND.src = "./sounds/life_sound.mp3";

const BRICK_BALL_HIT_SOUND = new Audio();
BRICK_BALL_HIT_SOUND.src = "./sounds/brick_ball_hit_sound.mp3";

const WIN_LEVEL_SOUND = new Audio();
WIN_LEVEL_SOUND.src = "./sounds/win_level_sound.mp3";

const VICTORY_SOUND = new Audio();
VICTORY_SOUND.src = "./sounds/victory_sound.mp3";
/////////SOUNDS/////////


/////////PLAYER/////////
let LIFE  		  = 3;
let SCORE 		  = 0;
let LEVEL 		  = 1;
const MAX_LEVEL	  = 3;
let GAME_OVER 	  = false;
let PLAYER_NAME   = "bot";
/////////PLAYER/////////

//////BUTTONS////////
var rightPressed = false;
var leftPressed  = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if(e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = true;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false;
	}
}
//////BUTTONS////////

/////PADDLE/////
const PADDLE_WIDTH         = 100;
const PADDLE_HEIGHT        = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const paddle = {
	x            : canvas.width/2 - PADDLE_WIDTH/2,
	y 	         : canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
	width        : PADDLE_WIDTH,
	height       : PADDLE_HEIGHT,
	dx	   	     : 5
};

function drawPaddle() {
	ctx.fillStyle = "#2e3548";
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.strokeStyle = "#ffcd05";
	ctx.lineWidth = 5;
	ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function movePaddle() {
	if(rightPressed && paddle.x < canvas.width-paddle.width) {
		paddle.x += paddle.dx;
	}
	else if(leftPressed && paddle.x > 0) {
		paddle.x -= paddle.dx;
	}
}
/////PADDLE/////

///////BALL///////
const BALL_RADIUS = 10;
const ball = {
	x 	   : canvas.width/2,
	y 	   : paddle.y -  BALL_RADIUS,
	radius : BALL_RADIUS,
	speed  : 6,
	dx	   : 3 * (Math.random()*2 - 1),
	dy	   : -3
	//dx=random and dy=-3 ensures that when the game starts ball move randomly towards top 
};

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();
}

function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;
}

function resetBallPosition() {
	ball.x          = canvas.width/2;
	ball.y          = paddle.y -  BALL_RADIUS;
	//setting ball.dx equal to any number between 1 and 3
	let min_range   = Math.random(); //between 0 and 1
	let min_2_range = min_range*2;   //between 0 and 2
	let min_1_range = min_2_range-1; //between -1 and 1
	//to make game interesting ball can move upward in any direction
	ball.dx         = 3 * (min_1_range);
	ball.dy         = -3;
}	

function check_ball_wall_collision() {
	if((ball.x + ball.radius > canvas.width) || (ball.x < ball.radius)) {
		WALL_BALL_HIT_SOUND.play();
		ball.dx = -ball.dx;
	}
	if(ball.y < ball.radius) {
		WALL_BALL_HIT_SOUND.play();
		ball.dy = -ball.dy;
	}
	
	if(ball.y + ball.radius > canvas.height) {
		LIFE--;
		$("#liveDisplay").text(LIFE);
		LIFE_SOUND.play();
		resetBallPosition();
	}
}

function check_ball_paddle_collision() {
	if((ball.x > paddle.x && ball.x < paddle.x + paddle.width) &&
	   (ball.y > paddle.y && ball.y < paddle.y+paddle.height)) {
		
		PADDLE_BALL_HIT_SOUND.play();
		
		let ball_paddle_collide_point_x = ball.x - (paddle.x+paddle.width/2);
		ball_paddle_collide_point_x /= (paddle.width/2);
		let angle = ball_paddle_collide_point_x * (Math.PI/3);
		ball.dx = ball.speed * Math.sin(angle);
		ball.dy = -(ball.speed * Math.cos(angle));
		/*
		Explanation:
		Since, we want to move the ball up according to the angle it hits at paddle,
		And we know : If ball is moving in y-axis with ball.dy speed and in x-axis
		with ball.dx speed, then we can find new ball.dx and ball.dy w.r.t angle it 
		makes with the paddle:
		cos (angle) = ball.dy/ball.speed;
		sin (angle) = ball.dx/ball.speed;
		
		Now, we need to find angle that ball makes with the paddle
		We can find it using the point where ball hits the paddle and using the
		x-coordinates of both of them at that moment as shown above.
		Range of values of collide point below :
		-paddle.width/2        0         +paddle.width/2
		Normalising it by dividing by paddle.width/2;
		-1                     0         +1
		COnverting them to angles :
		-60 degree			   0         +60 degree
		
		so, putting in equations above
		ball.dy = 1.5          3         +1.5           
		ball.dx = -2.7         0         +2.7
		So, we need to negate the ball.dy to make it go up
		*/
	}
}

///////BALL///////

////////BRICK///////
const brick = {
	row 		: 2,
	column 		: 11,
	width 		: 55,
	height      : 20,
	offSetLeft  : 20,
	offSetTop   : 20,
	marginTop   : 40,
	fillColor   : "#2e3548",
	strokeColor : "black"
};
let bricks = [];
createBricks();
function createBricks() {
	for(var r=0; r<brick.row; r++) {
			bricks[r] = [];
			for(var c=0; c<brick.column; c++) {
				bricks[r][c] = {
								x 	   : c*(brick.offSetLeft + brick.width) + brick.offSetLeft,
								y      : r*(brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
								status : true								
							};
			}
	}
}

function drawBricks() {
	for(var r=0; r<brick.row; r++) {
		for(var c=0; c<brick.column; c++) {
			let b = bricks[r][c];
			if(b.status) {
				ctx.fillStyle = brick.fillColor;
				ctx.fillRect(b.x, b.y, brick.width, brick.height);
				
				ctx.strokeStyle = brick.strokeColor;
				ctx.strokeRect(b.x, b.y, brick.width, brick.height);
			}
		}
	}	
}

function check_ball_brick_collision() {
	for(var r=0; r<brick.row; r++) {
		for(var c=0; c<brick.column; c++) {
			let b = bricks[r][c];
			if(b.status) {
				if((ball.x+ball.radius > b.x) && 
				  (ball.x - ball.radius < b.x+brick.width) &&
				  (ball.y + ball.radius > b.y) &&
				  (ball.y - ball.radius < b.y+brick.height)				  
				  ) {
					BRICK_BALL_HIT_SOUND.play()
					b.status = false;
					ball.dy = -ball.dy;
					SCORE += 5;
					$("#scoreDisplay").text(SCORE);
				}
			}
		}
	}
}
////////BRICK///////

//////GAME MISCELLANEOUS//////
function showGameMisc(text, textX, textY, img, imgX, imgY, imgW, imgH) {
	ctx.fillStyle = "#FFF";
	ctx.font = "20px Comic Sans MS, cursive, sans-serif";
	ctx.fillText(text, textX, textY);
	ctx.drawImage(img, imgX, imgY, imgW, imgH);
}

function check_is_GameOver() {
	if(LIFE <= 0) {
		showLose();
		GAME_OVER = true;
	}
}

function check_is_level_up() {
	let IS_LEVEL_DONE = true;
	for(var r=0; r<brick.row; r++) {
		for(var c=0; c<brick.column; c++) {
			let b = bricks[r][c];
			IS_LEVEL_DONE = IS_LEVEL_DONE && !(b.status);
		}
	}
	if(IS_LEVEL_DONE) {
		WIN_LEVEL_SOUND.play();
		if(LEVEL >= MAX_LEVEL) { //player won all
			VICTORY_SOUND.play();
			GAME_OVER = true;
			showVictory();
			return;
		}
		brick.row++;
		createBricks();
		ball.speed += 0.5;
		resetBallPosition();
		LEVEL++;
		$("#levelDisplay").text(LEVEL);		
	}
}
//////GAME MISCELLANEOUS//////


///////driver function//////
function makeMyGame() { 
	//draw//
	ctx.drawImage(backGroundImage, 0, 0, backGroundImage.width, backGroundImage.height, 0, 0, canvas.width, canvas.height);
	drawPaddle();
	drawBall();
	movePaddle();
	moveBall();
	drawBricks();
	showGameMisc(LIFE, canvas.width-25, 32, lifeImage, canvas.width-75, 3, 50, 50);
	showGameMisc(SCORE, 59, 32, scoreImage, 5, 5, 50, 45);
	showGameMisc(LEVEL, canvas.width/2+20, 30, levelImage, canvas.width/2-50, 2.5, 90, 50);
	//draw//
	
	//update//
	check_ball_wall_collision();
	check_ball_paddle_collision();
	check_ball_brick_collision();
	check_is_GameOver();
	check_is_level_up();
	if(!GAME_OVER) {
		requestAnimationFrame(makeMyGame);
	}
	//update//
}

///////driver function//////
$( "#startGame" ).click(function() {
  PLAYER_NAME = $("#fname").val();
  $("#sound_icon").css("display", "block");
  $("#GameDescriptionArea").css({"right": "20px"});
  makeMyGame();
});
///////driver function//////

//sound clipart
const sound_icon = document.getElementById("sound_icon");
sound_icon.addEventListener("click", changeSoundIcon);
function changeSoundIcon() {
	let imgSource = sound_icon.getAttribute("src");
	let SOUND_IMG = imgSource == "cliparts/sound.png" ? "cliparts/mute.png" : "cliparts/sound.png";
	sound_icon.setAttribute("src", SOUND_IMG);
	
	PADDLE_BALL_HIT_SOUND.muted = PADDLE_BALL_HIT_SOUND.muted ? false : true;
	BRICK_BALL_HIT_SOUND.muted 	= BRICK_BALL_HIT_SOUND.muted ? false : true;
	WALL_BALL_HIT_SOUND.muted 	= WALL_BALL_HIT_SOUND.muted ? false : true;
	WIN_LEVEL_SOUND.muted 		= WIN_LEVEL_SOUND.muted ? false : true;
	VICTORY_SOUND.muted 		= VICTORY_SOUND.muted ? false : true;
	LIFE_SOUND.muted 			= LIFE_SOUND.muted ? false : true;
}

const EndGame = document.getElementById("EndGame");
const victory = document.getElementById("victory");
const victoryText = document.getElementById("victoryText");
const lose = document.getElementById("lose");
const restart = document.getElementById("restart");

restart.addEventListener("click", function(){
	location.reload();
})

victoryText.addEventListener("click", function(){
	location.reload();
})

function showVictory(){
	EndGame.style.display = "block";
	victory.style.display = "block";
	victoryText.style.display = "block";
}

function showLose(){
	EndGame.style.display = "block";
	lose.style.display 	  = "block";
	restart.style.display = "block";
}
