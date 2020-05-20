var myGamePiece;
var myObstacles = [];
var myScore;
var W = 1000;
var H = 270;

//snowflake
var angle = 0;
var mf = 100; //max flakes
var flakes = [];

function startGame() {
	myGamePiece = new component(15, 120, "red", 8);
    myObstacle  = new component(400, 120, "green", 10);  
	myScore		= new component(280, 40, "yellow", "15px", "text");
    myGameArea.start();
}

//contains whole canvas (inside which there is the ball)
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = W;
        this.canvas.height = H;
		this.frameNo = 0;
		this.keys = [];
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
        this.interval1 = window.requestAnimationFrame(updateGameArea);
		////////////////////////
		for(var i =0; i < mf; i++) {
			flakes.push({x: Math.random()*W,
						y: Math.random()*H,
						r: Math.random()*1+1, //min of 2px and max of 7px
						d: Math.random() + 1 //density of flakes
						})
		}
		////////////////////////
		this.interval2 = window.requestAnimationFrame(drawFlakes);
		window.addEventListener('keydown', function (e) {
		  myGameArea.keys = (myGameArea.keys || []);
		  myGameArea.keys[e.keyCode] = (e.type == "keydown");;
		})
		window.addEventListener('keyup', function (e) {
		  myGameArea.keys[e.keyCode] = (e.type == "keydown");;
		})
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	stop : function() {
		//clearInterval(this.interval2);
		//clearInterval(this.interval1);
		document.location.reload();
	}
}


function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function updateGameArea() {	
	var x, height, gap, minHeight, maxHeight, minGap, maxGap;
	for (i = 0; i < myObstacles.length; i += 1) {
		if (myGamePiece.crashWith(myObstacles[i])) {
			myGameArea.stop();
			document.getElementById("GameOver").style.display = "block";
			return;
		}
	}
	myGameArea.clear();
	myGameArea.frameNo +=1;
	if (myGameArea.frameNo == 1 || everyinterval(50)) {
		x = myGameArea.canvas.width; //always comes from the right end
		minHeight = 20;
		maxHeight = 200;
		height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
		minGap = 50;
		maxGap = 200;
		minRadius = 20;
		maxRadius = 30;
		radius = Math.floor(Math.random()*(maxRadius-minRadius+1)+minRadius);
		gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
		myObstacles.push(new component(x, height-gap, "green", radius)); //top obstacle
		myObstacles.push(new component(x/2, height-gap, "green", radius)); //top obstacle
		myObstacles.push(new component(x, height + gap, "green", radius)); //bottom obstacle
	}
	for (i = 0; i < myObstacles.length; i += 1) {
		myObstacles[i].x += -6;
		myObstacles[i].update();
	}
	myScore.text = "SCORE: " + myGameArea.frameNo;
	myScore.update();
	//myGamePiece.speedX = 0;
    //myGamePiece.speedY = 0; 
	if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
	if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
	if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
	if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
	myGamePiece.newPos();    
	myGamePiece.update();
	window.requestAnimationFrame(updateGameArea);
}

function drawFlakes() {
	var ctx = myGameArea.context;
	ctx.fillStyle = "white";
	ctx.beginPath();
	for(var i = 0; i < mf; i++) {
		var f = flakes[i];
		ctx.moveTo(f.x, f.y);
		ctx.arc(f.x, f.y, f.r, 0, Math.PI*2, true);
	}
	ctx.fill();
	moveFlakes();
	window.requestAnimationFrame(drawFlakes);
}

//animate the flakes
	
function moveFlakes() {
	angle += 0.01;
	for(var i =0; i<mf; i++) {
		//store current flake
		var f = flakes[i];
		//update X and Y coordinates of each snowflake
		f.y += Math.pow(f.d, 2) + 1;
		f.x += Math.sin(angle) * 2;
		
		//if the snowflake reaches the bottom, send a new one to the top
		if(f.y > H) {
			flakes[i] = {x: Math.random()*W,
						y: 0, 
						r: f.r, 
						d: f.d
						};
					}
	}
}

//properties of each ball we make inside canvas
function component(x, y, color, radius, type) {
	this.type = type;
	this.radius = radius;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.radius + " " + "Orbitron";
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.strokeStyle = '#003300';
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.fillStyle = color;
			ctx.fill();
		}
    }
    this.newPos = function() {
        this.x += this.speedX*2;
        this.y += this.speedY*2;        
    }
	
	this.crashWith = function(otherobj) {
        var myleft = this.x - (this.radius);
        var myright = this.x + (this.radius);
        var mytop = this.y - (this.radius);
        var mybottom = this.y + (this.radius);
        var otherleft = otherobj.x - (this.radius);
        var otherright = otherobj.x + (otherobj.radius);
        var othertop = otherobj.y - (this.radius);
        var otherbottom = otherobj.y + (otherobj.radius);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}