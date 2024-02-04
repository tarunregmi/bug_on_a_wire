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
