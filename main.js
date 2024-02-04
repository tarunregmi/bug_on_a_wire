// Some global constants that remain unchanged throughout the game
const cnv = document.createElement("canvas");                                           // canvas element to render game
const ctx = cnv.getContext("2d");                                                       // canvas 2d context
const cnvAspectRatio = 2;                                                               // canvas width:height
const cnvWidth = cnv.width = 1080;                                                      // width of canvas
const cnvHeight = cnv.height = cnvWidth/cnvAspectRatio;                                 // height of canvas
const wires = [192, 254, 316];                                                          // array that contains x-coordinate of every wire
const collideErr = 10;                                                                  // collision error threshold
const gameSpeed = 2;
