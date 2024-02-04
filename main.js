// Some global constants that remain unchanged throughout the game
const cnv = document.createElement("canvas");                                           // canvas element to render game
const ctx = cnv.getContext("2d");                                                       // canvas 2d context
const cnvAspectRatio = 2;                                                               // canvas width:height
const cnvWidth = cnv.width = 1080;                                                      // width of canvas
const cnvHeight = cnv.height = cnvWidth/cnvAspectRatio;                                 // height of canvas
const wires = [192, 254, 316];                                                          // array that contains x-coordinate of every wire
const collideErr = 10;                                                                  // collision error threshold
const gameSpeed = 2;

// global ctx settings
ctx.font = "22px serif";
ctx.fillStyle = "#444";

// Images that are used in the game
const backgroundImg = new Image(); backgroundImg.src = "./assets/background.png";
const obstacleImg = new Image(); obstacleImg.src = "./assets/obstacle_36.56x40.png";
const bugImg = new Image(); bugImg.src = "./assets/bug_51.4x40.png";

// Some DOM elements used to manipulate and control the game
const infoSection = document.getElementById("info");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const scoreboard = document.getElementById("scoreboard");
const messageBox = document.querySelector(".message");



// blueprint of game background
class Background {
    constructor(img) {
        this.img = img;
        this.x1 = 0;
        this.x2 = cnvWidth;
    }
    
    draw() {
        ctx.drawImage(this.img, this.x1, 0, cnvWidth, cnvHeight);
        ctx.drawImage(this.img, this.x2, 0, cnvWidth, cnvHeight);
        this.x1 -= gameSpeed;
        this.x2 -= gameSpeed;

        if (this.x1 <= -cnvWidth) this.x1 = cnvWidth;
        else if (this.x2 <= -cnvWidth) this.x2 = cnvWidth;
    }
}


// blueprint of bugs in the game
class Bug {
    constructor(img) {
        this.x = 10;                                                                    // initial horizonal position of bug
        this.img = img;                                                                 // actual image sprite
        this.frame = 0;                                                                 // varible to make animated bug
        this.width = this.img.width / 15;                                               // width of single frame
        this.height = this.img.height;                                                  // height of single frame
    }

    draw(y) {
        ctx.drawImage(this.img, this.frame*this.width, 0, this.width, this.height, this.x, y-this.height, this.width, this.height);
        this.frame++;
        if (this.frame >= 15) this.frame = 0;                                           // reset frame number when it is more than actual frame number
    }
}


// blueprint of obstacles in the game
class Obstacle {
    constructor (img, dv) {
        this.x = cnvWidth;
        this.y = wires[Math.floor(Math.random()*wires.length)];
        this.speed = Math.floor(gameSpeed + Math.random()*dv);
        this.img = img;
        this.frame = 0;
        this.width = this.img.width / 18;
        this.height = this.img.height;
    }

    draw() {
        ctx.drawImage(this.img, this.frame*this.width, 0, this.width, this.height, this.x, this.y-this.height, this.width, this.height);
        this.frame++;
        if (this.frame >= 18) this.frame = 0;
        this.x -= this.speed;
    }
}


// Some variables that are used to hold the game's dynamic state and data
let background = new Background(backgroundImg);
let bug = new Bug(bugImg);
let bugPosition = 1;
let gameOver = false;
let obstacles = [];
let staggerFrames = 0;
let score = 0;
let level = 100;


function startGame() {
    console.log("st");
    infoSection.classList.add("transparent");
    startButton.setAttribute("hidden", "");
    restartButton.setAttribute("hidden", "");
    animate();
}

function restartGame() {
    if (gameOver) {
        background = new Background(backgroundImg);
        bug = new Bug(bugImg);
        bugPosition = 1;
        gameOver = false;
        obstacles.length = 0;
        staggerFrames = 0;
        score = 0;
        level = 100;
        startGame();
    }
}

function afterGameOver() {
    if (localStorage.getItem("highestScore") < score) localStorage.setItem("highestScore", score);
    messageBox.innerHTML = `Game Over!!!<br>The bug successfully avoided ${score} obstacles.`;
    document.getElementById("yourScore").textContent = score;
    document.getElementById("highestScore").textContent = Number(localStorage.getItem("highestScore"));
    infoSection.classList.remove("transparent");
    scoreboard.removeAttribute("hidden");
    startButton.setAttribute("hidden", "");
    restartButton.removeAttribute("disabled");
    restartButton.removeAttribute("hidden");
}


function animate() {
    ctx.clearRect(0, 0, cnvWidth, cnvHeight);

    background.draw();
    bug.draw(wires[bugPosition]);

    obstacles.forEach((obstacle) => {
        obstacle.draw();

        // collision detection
        if (obstacle.y === wires[bugPosition]) {
            if (bug.x < obstacle.x + obstacle.width + collideErr && bug.x + bug.width - collideErr > obstacle.x) {
                gameOver = true;
                afterGameOver();
            }
        }
    });

    // remove obstacle that is out from canvas and increase score
    obstacles = obstacles.filter(obstacle => {
        if (obstacle.x > -50) return obstacle;
        score++;
        level -= Math.ceil((score/level));
    });

    // generate obstacles
    if (staggerFrames > level) {
        obstacles.push(new Obstacle(obstacleImg, 8));
        staggerFrames = 0;
        if (level < 40) level = 70;
    }
    staggerFrames++;

    ctx.fillText(`Score: ${score}`, 20, 40);
    
    if (!gameOver) requestAnimationFrame(animate);
}


// setup game when everything is loaded
window.addEventListener("load", () => {
    document.getElementById("game").insertAdjacentElement("beforeend", cnv);
    startButton.addEventListener("click", startGame, {once: true});
    restartButton.addEventListener("click", restartGame);
    if (window.innerWidth < cnvWidth) alert(`Your device width (${window.innerWidth}px) is less than the game needs (${cnvWidth}px), so some part of this game is out of window.\n\nPlease zoom out and play.`)
});


// detect arrow key pressed by player and perform relative task
window.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowUp") {
        bugPosition--;
        if (bugPosition < 0) bugPosition = wires.length-1;
    } else if (ev.key === "ArrowDown") {
        bugPosition++;
        if (bugPosition == wires.length) bugPosition = 0;
    }
});