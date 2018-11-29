/*************************************
 *   Computer Graphics - Homework 2   *
 *   Insect Simulator                 *
 *                                    *
 *   Buğra Felekoğlu                  *
 *   21301200                         *
 *************************************/

// WebGL
var gl;
var program;
var canvas;

// Global variables
var isFileExist = false;
var isRunning = false;
var projectionMatrix;
var instanceMatrix;
var modelViewMatrix;
var modelViewMatrixLoc;

// Arrays for figure, stack of hierarchical model and vertices to draw
var figure = [];  
var stack = [];
var vertices = [];

// Indices of body parts of spider figure
var bodyId = 0;
var headId = 1;
var rearId = 2;
var leftFrontUpperLegId = 3;
var leftFrontLowerLegId = 4;
var leftCenterUpperLegId = 5;
var leftCenterLowerLegId = 6;
var leftBackUpperLegId = 7;
var leftBackLowerLegId = 8;
var rightFrontUpperLegId = 9;
var rightFrontLowerLegId = 10;
var rightCenterUpperLegId = 11;
var rightCenterLowerLegId = 12;
var rightBackUpperLegId = 13;
var rightBackLowerLegId = 14;

// Numver of total body parts (nodes)
var numNodes = 15; 

// Constant height and width values of nodes
const BODY_HEIGHT = 1.6;
const BODY_WIDTH = 1.2;
const HEAD_HEIGHT = 1.6;
const HEAD_WIDTH = 1.8;
const REAR_HEIGHT = 2.2;
const REAR_WIDTH = 2.2;
const LEG_HEIGHT = 3.0;
const LEG_WIDTH = 0.3;

// Constant color values for each body part
const BODY_COLOR = vec4(129, 81, 55, 255);
const HEAD_COLOR = vec4(100, 60, 15, 255);
const REAR_COLOR = vec4(61, 28, 11, 255);
const FRONT_LEG_COLOR = vec4(104, 36, 4, 255);
const CENTER_LEG_COLOR = vec4(128, 64, 4, 255);
const BACK_LEG_COLOR = vec4(89, 24, 21, 255);

var curTranslateX;
var curTranslateY;
var curTranslateZ;
var curTheta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var translateX;
var translateY;
var translateZ;
var theta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var thetaList = [];
var transList = [];
var loadedThetaList = [];
var loadedTransList = [];

var timet;
var timetLoc;
var interpolationFrame = 0;

/***************************************************
  Prepared animation frames
****************************************************/
function animationFrames() {
  thetaList = [
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [-75, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [-75, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [105, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [105, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [105, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [105, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [105, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [105, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [105, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [105, 0, 0, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30],
    [105, 0, 0, 0, -30, 30, -60, 0, -30, 30, -60, 0, -30, 30, -60],
    [105, 0, 0, 30, -60, 30, -60, 30, -60, 30, -60, 30, -60, 30, -60], //0,0,0
    [105, 0, 0, 0, -50, 0, -50, 0, -50, 0, -50, 0, -50, 0, -50],
    [105, 0, 0, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
    [105, 0, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0, -60, 0],
  ];

  transList = [
    [18, 1, 0],
    [16, 1, 0],
    [14, 1, 0],
    [12, 1, 0],
    [10, 1, 0],
    [8, 1, 0],
    [6, 1, 0],
    [4, 1, 0],
    [2, 1, 0],
    [0, 1, 0],
    [-2, 1, 0],
    [-4, 1, 0],
    [-6, 1, 0],
    [-8, 1, 0],
    [-10, 1, 0],
    [-12, 1, 0],
    [-14, 1, 0],
    [-16, 1, 0],
    [-18, 1, 0],
    [-18, 1, 0],
    [-16, 1, 0],
    [-14, 1, 0],
    [-12, 1, 0],
    [-10, 1, 0],
    [-8, 1, 0],
    [-6, 1, 0],
    [-4, 1, 0],
    [-2, 1, 0],
    [0, 0, 0],
    [2, 2, 0],
    [4, 4, 0],
    [6, 6, 0],
    [8, 8, 0],
    [10, 10, 0],
    [12, 12, 0],
    [14, 14, 0],
    [16, 16, 0],
    [18, 18, 0],
  ]
}

/***************************************************
  Init function of window
****************************************************/
window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) alert("WebGL isn't available");

  // Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Draggable UI Elements
  dragElement(document.getElementById("UIButtons"));
  dragElement(document.getElementById("UISliders"));

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.width);
  gl.clearColor(0.24, 0.61, 0.93, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initiating variables
  instanceMatrix = mat4();
  timet = 0;
  translateZ = 0;
  translateY = 0;
  translateX = 0;

  // Creating projection and mv matrices
  projectionMatrix = perspective(90, 1, 0.02, 200);
  modelViewMatrix = lookAt(vec3(0, 4, -10), vec3(0, 1, 0), vec3(0, 1, 0));

  // Sending matrices to shader
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
  
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  timetLoc = gl.getUniformLocation(program, "timet");

  clickAddKeyframeButton();
  clickDeleteKeyframeButton();
  clickPlayButton();
  clickAnimationButton();
  clickSaveButton();
  clickLoadButton();
  chooseFile();
  sliders();
  cube();

  for (i = 0; i < numNodes; i++) 
    updateNodes(i);

  drawGround();
  render();
};

/***************************************************
  Render Function which includes animation and
    static picture of spider figure  
****************************************************/
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawGround();

  if (isRunning) {  // Animation
    if (timet < 1) {
      timet += 0.04;  // Speed of animation
    } else {
      interpolationFrame = (interpolationFrame + 1) % thetaList.length;
      timet = 0;
    }

    var curFrame = interpolationFrame;
    var nextFrame = (interpolationFrame + 1) % thetaList.length;

    for (var i = 0; i < theta.length; i++) {
      curTheta[i] = thetaList[curFrame][i] * (1 - timet) + thetaList[nextFrame][i] * timet;
      updateNodes(i);
    }

    curTranslateX = transList[curFrame][0] * (1 - timet) + transList[nextFrame][0] * timet;
    curTranslateY = transList[curFrame][1] * (1 - timet) + transList[nextFrame][1] * timet;
    curTranslateZ = transList[curFrame][2] * (1 - timet) + transList[nextFrame][2] * timet;
    updateNodes(bodyId);
  } 
  else {  // Static picture
    for (var i = 0; i < theta.length; i++) {
      curTheta[i] = theta[i];
      updateNodes(i);
    }
    curTranslateX = translateX;
    curTranslateY = translateY;
    curTranslateZ = translateZ;
    updateNodes(bodyId);
  }

  gl.uniform1f(timetLoc, timet);
  traverse(bodyId);
  requestAnimFrame(render);
}

/***************************************************
  Creates new nodes with different parameters:
    -transform matrix
    -render function
    -sibling node
    -child node
****************************************************/
function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  }
  return node;
}

/***************************************************
  Node updates according to user chosen 
    translation and rotation parameters
****************************************************/
function updateNodes(id) {
  var m = mat4();

  switch (id) {
    case bodyId:
      m = translate(-curTranslateX, curTranslateY, curTranslateZ);
      m = mult(m, rotate(curTheta[bodyId], 0, 1, 0));
      m = mult(m, rotate(-90, 0, 0, 1));
      m = mult(m, rotate(-75, 1, 0, 0));
      figure[bodyId] = createNode(m, body, null, headId);
      break;

    case headId:
      m = translate(0.0, 0.8 * BODY_HEIGHT, 0.0);
      m = mult(m, rotate(curTheta[headId], 0, 0, 1));
      m = mult(m, translate(0.0, -0.8 * BODY_HEIGHT, 0.0));
      figure[headId] = createNode(m, head, rearId, null);
      break;

    case rearId:
      m = translate(-0.2, -BODY_HEIGHT, 0.0);
      m = mult(m, rotate(curTheta[rearId], 0, 0, 1));
      m = mult(m, translate(0.2, BODY_HEIGHT, 0.0));
      figure[rearId] = createNode(m, rear, leftFrontUpperLegId, null);
      break;

    case leftFrontUpperLegId:
      m = translate(0.0, 0.8, -1.8);
      m = mult(m, rotate(120, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[leftFrontUpperLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-120, 1, 0, 0));
      m = mult(m, translate(0.0, -0.8, 1.8));
      figure[leftFrontUpperLegId] = createNode(m, leftFrontUpperLeg, leftCenterUpperLegId, leftFrontLowerLegId);
      break;

    case leftCenterUpperLegId:
      m = translate(0.0, 0.0, -1.8);
      m = mult(m, rotate(90, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[leftCenterUpperLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-90, 1, 0, 0));
      m = mult(m, translate(0.0, 0.0, 1.8));
      figure[leftCenterUpperLegId] = createNode(m, leftCenterUpperLeg, leftBackUpperLegId, leftCenterLowerLegId);
      break;

    case leftBackUpperLegId:
      m = translate(0.0, -0.8, -1.8);
      m = mult(m, rotate(60, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[leftBackUpperLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-60, 1, 0, 0));
      m = mult(m, translate(0.0, 0.8, 1.8));
      figure[leftBackUpperLegId] = createNode(m, leftBackUpperLeg, rightFrontUpperLegId, leftBackLowerLegId);
      break;

    case rightFrontUpperLegId:
      m = translate(0.0, 0.8, 1.8);
      m = mult(m, rotate(-120, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[rightFrontUpperLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(120, 1, 0, 0));
      m = mult(m, translate(0.0, -0.8, -1.8));
      figure[rightFrontUpperLegId] = createNode(m, rightFrontUpperLeg, rightCenterUpperLegId, rightFrontLowerLegId);
      break;

    case rightCenterUpperLegId:
      m = translate(0.0, 0.0, 1.8);
      m = mult(m, rotate(-90, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[rightCenterUpperLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(90, 1, 0, 0));
      m = mult(m, translate(0.0, 0.0, -1.8));
      figure[rightCenterUpperLegId] = createNode(m, rightCenterUpperLeg, rightBackUpperLegId, rightCenterLowerLegId);
      break;

    case rightBackUpperLegId:
      m = translate(0.0, -0.8, 1.8);
      m = mult(m, rotate(-60, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[rightBackUpperLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(60, 1, 0, 0));
      m = mult(m, translate(0.0, 0.8, -1.8));
      figure[rightBackUpperLegId] = createNode(m, rightBackUpperLeg, null, rightBackLowerLegId);
      break;

    case leftFrontLowerLegId:
      m = translate(-0.55, 2.2, -4.2);
      m = mult(m, rotate(120, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[leftFrontLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-120, 1, 0, 0));
      m = mult(m, translate(0.55, -2.2, 4.2));
      figure[leftFrontLowerLegId] = createNode(m, leftFrontLowerLeg, null, null);
      break;

    case leftCenterLowerLegId:
      m = translate(-0.55, 0.0, -4.55);
      m = mult(m, rotate(90, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[leftCenterLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-90, 1, 0, 0));
      m = mult(m, translate(0.55, 0.0, 4.55));
      figure[leftCenterLowerLegId] = createNode(m, leftCenterLowerLeg, null, null);
      break;

    case leftBackLowerLegId:
      m = translate(-0.55, -2.2, -4.2);
      m = mult(m, rotate(60, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[leftBackLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-60, 1, 0, 0));
      m = mult(m, translate(0.55, 2.2, 4.2));
      figure[leftBackLowerLegId] = createNode(m, leftBackLowerLeg, null, null);
      break;

    case rightFrontLowerLegId:
      m = translate(-0.55, 2.2, 4.2);
      m = mult(m, rotate(-120, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[rightFrontLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(120, 1, 0, 0));
      m = mult(m, translate(0.55, -2.2, -4.2));
      figure[rightFrontLowerLegId] = createNode(m, rightFrontLowerLeg, null, null);
      break;

    case rightCenterLowerLegId:
      m = translate(-0.55, 0.0, 4.55);
      m = mult(m, rotate(-90, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[rightCenterLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(90, 1, 0, 0));
      m = mult(m, translate(0.55, 0.0, -4.55));
      figure[rightCenterLowerLegId] = createNode(m, rightCenterLowerLeg, null, null);
      break;

    case rightBackLowerLegId:
      m = translate(-0.55, -2.2, 4.2);
      m = mult(m, rotate(-60, 1, 0, 0));
      m = mult(m, translate(0.0, LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(-curTheta[rightBackLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, -LEG_HEIGHT/2, 0.0));
      m = mult(m, rotate(60, 1, 0, 0));
      m = mult(m, translate(0.55, 2.2, -4.2));
      figure[rightBackLowerLegId] = createNode(m, rightBackLowerLeg, null, null);
      break;
  }
}

/***************************************************
  Traverses the node tree recursively 
    and renders nodes
****************************************************/
function traverse(id) {
  if (id == null) 
    return;

  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[id].transform);
  figure[id].render();

  if (figure[id].child != null) 
    traverse(figure[id].child);
  modelViewMatrix = stack.pop();

  if (figure[id].sibling != null) 
    traverse(figure[id].sibling);
}

/***************************************************
  Render functions of each nodes
****************************************************/

function body() {
  instanceMatrix = mult(modelViewMatrix, scale4(BODY_WIDTH, BODY_HEIGHT, BODY_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(BODY_COLOR);
}

function head() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.8 * BODY_HEIGHT, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(HEAD_WIDTH, HEAD_HEIGHT, HEAD_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(HEAD_COLOR);
}

function rear() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.2, -BODY_HEIGHT, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(REAR_WIDTH, REAR_HEIGHT, REAR_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(REAR_COLOR);
}

function leftFrontUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.8, -1.8));
  instanceMatrix = mult(instanceMatrix, rotate(120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(FRONT_LEG_COLOR);
}

function leftCenterUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, -1.8));
  instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(CENTER_LEG_COLOR);
}

function leftBackUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.8, -1.8));
  instanceMatrix = mult(instanceMatrix, rotate(60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(BACK_LEG_COLOR);
}

function rightFrontUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.8, 1.8));
  instanceMatrix = mult(instanceMatrix, rotate(-120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(FRONT_LEG_COLOR);
}

function rightCenterUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 1.8));
  instanceMatrix = mult(instanceMatrix, rotate(-90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(CENTER_LEG_COLOR);
}

function rightBackUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.8, 1.8));
  instanceMatrix = mult(instanceMatrix, rotate(-60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(BACK_LEG_COLOR);
}

function leftFrontLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 2.2, -4.2));
  instanceMatrix = mult(instanceMatrix, rotate(120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(FRONT_LEG_COLOR);
}

function leftCenterLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 0.0, -4.55));
  instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(CENTER_LEG_COLOR);
}

function leftBackLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, -2.2, -4.2));
  instanceMatrix = mult(instanceMatrix, rotate(60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(BACK_LEG_COLOR);
}

function rightFrontLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 2.2, 4.2));
  instanceMatrix = mult(instanceMatrix, rotate(-120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(FRONT_LEG_COLOR);
}

function rightCenterLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 0.0, 4.55));
  instanceMatrix = mult(instanceMatrix, rotate(-90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(CENTER_LEG_COLOR);
}

function rightBackLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, -2.2, 4.2));
  instanceMatrix = mult(instanceMatrix, rotate(-60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -LEG_HEIGHT/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart(BACK_LEG_COLOR);
}

/***************************************************
  Draws body parts of figure (with using cubes)  
****************************************************/
function drawBodyPart(color) {
  processBuffers(color, vertices, 4);
  for(var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

/***************************************************
  Draws body parts of figure (with using cubes)  
****************************************************/
function drawGround() {
  var vertices = [
    vec3(-64, -0.8, -32),
    vec3(-64, -0.8, 32),
    vec3(64, -0.8, 32),
    vec3(64, -0.8, -32)
  ];

  instanceMatrix = mult(modelViewMatrix, scale4(BODY_WIDTH, BODY_HEIGHT, BODY_WIDTH));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

  processBuffers(vec4(46, 168, 34, 255), vertices, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

/***************************************************
  Custom scale function for mat4 type of matrices
****************************************************/
function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

/***************************************************
  Slider listeners
****************************************************/
function sliders() {
  document.getElementById("sliderBody").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("bodyText").value = sliderValue;
    theta[bodyId] = sliderValue;
    updateNodes(bodyId);
  };

  document.getElementById("sliderHead").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("headText").value = sliderValue;
    theta[headId] = sliderValue;
    updateNodes(headId);
  };

  document.getElementById("sliderRear").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("rearText").value = sliderValue;
    theta[rearId] = sliderValue;
    updateNodes(rearId);
  };

  document.getElementById("sliderLFU").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("LFUText").value = sliderValue;
    theta[leftFrontUpperLegId] = sliderValue;
    updateNodes(leftFrontUpperLegId);
  };

  document.getElementById("sliderLFL").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("LFLText").value = sliderValue;
    theta[leftFrontLowerLegId] = sliderValue;
    updateNodes(leftFrontLowerLegId);
  };

  document.getElementById("sliderLCU").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("LCUText").value = sliderValue;
    theta[leftCenterUpperLegId] = sliderValue;
    updateNodes(leftCenterUpperLegId);
  };

  document.getElementById("sliderLCL").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("LCLText").value = sliderValue;
    theta[leftCenterLowerLegId] = sliderValue;
    updateNodes(leftCenterLowerLegId);
  };

  document.getElementById("sliderLBU").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("LBUText").value = sliderValue;
    theta[leftBackUpperLegId] = sliderValue;
    updateNodes(leftBackUpperLegId);
  };

  document.getElementById("sliderLBL").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("LBLText").value = sliderValue;
    theta[leftBackLowerLegId] = sliderValue;
    updateNodes(leftBackLowerLegId);
  };

  document.getElementById("sliderRFU").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("RFUText").value = sliderValue;
    theta[rightFrontUpperLegId] = sliderValue;
    updateNodes(rightFrontUpperLegId);
  };

  document.getElementById("sliderRFL").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("RFLText").value = sliderValue;
    theta[rightFrontLowerLegId] = sliderValue;
    updateNodes(rightFrontLowerLegId);
  };

  document.getElementById("sliderRCU").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("RCUText").value = sliderValue;
    theta[rightCenterUpperLegId] = sliderValue;
    updateNodes(rightCenterUpperLegId);
  };

  document.getElementById("sliderRCL").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("RCLText").value = sliderValue;
    theta[rightCenterLowerLegId] = sliderValue;
    updateNodes(rightCenterLowerLegId);
  };

  document.getElementById("sliderRBU").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("RBUText").value = sliderValue;
    theta[rightBackUpperLegId] = sliderValue;
    updateNodes(rightBackUpperLegId);
  };

  document.getElementById("sliderRBL").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("RBLText").value = sliderValue;
    theta[rightBackLowerLegId] = sliderValue;
    updateNodes(rightBackLowerLegId);
  };

  document.getElementById("sliderX").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("XText").value = sliderValue;
    translateX = sliderValue;
    updateNodes(bodyId);
  };

  document.getElementById("sliderY").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("YText").value = sliderValue;
    translateY = sliderValue;
    updateNodes(bodyId);
  };

  document.getElementById("sliderZ").oninput = function() {
    var sliderValue = event.srcElement.value; 
    document.getElementById("ZText").value = sliderValue;
    translateZ = sliderValue;
    updateNodes(bodyId);
  };
}

/***************************************************
  Add Keyframe button listener
****************************************************/
function clickAddKeyframeButton() {
  var button = document.getElementById("AddKeyframe");
  var list = document.getElementById("KeyFrameList");

  // Listener for Add Keyframe button
  button.addEventListener("click", function () {
    thetaList.push(theta.slice());
    transList.push([translateX, translateY, translateZ]);

    var keyframe = document.createElement("option");
    keyframe.text = "ThetaList: " + thetaList[thetaList.length-1] +
                   " XYZ: " + transList[transList.length-1];
    list.add(keyframe);

    for(i = 0; i < numNodes; i++) 
      updateNodes(i);
  });
}

/***************************************************
  Delete Keyframe button listener
****************************************************/
function clickDeleteKeyframeButton() {
  var button = document.getElementById("DeleteKeyframe");
  var list = document.getElementById("KeyFrameList");

  // Listener for Delete Keyframe button
  button.addEventListener("click", function () {
    var selectedIndex = list.selectedIndex;

    if(selectedIndex != -1) {
      list.remove(selectedIndex);
      thetaList.splice(selectedIndex, 1);
      transList.splice(selectedIndex, 1);
    } else {
      alert("Please first select a frame to delete it.");
    }
  });
}

/***************************************************
  Play button listener
****************************************************/
function clickPlayButton() {
  var button = document.getElementById("Play");

  // Listener for Play button
  button.addEventListener("click", function () {
    if(thetaList.length == 0 || transList.length == 0) {
      alert("Please add a keyframe before playing frames.");
    } else {
      isRunning = !isRunning;
      interpolationFrame = 0;
      timet = 0;
    }
  });
}

/***************************************************
  Animation button listener
****************************************************/
function clickAnimationButton() {
  var button = document.getElementById("Animation");

  // Listener for Animation button
  button.addEventListener("click", function () {
    animationFrames();
    isRunning = !isRunning;
    interpolationFrame = 0;
    timet = 0;
  });
}

/***************************************************
  Save button listener
****************************************************/
function clickSaveButton() {
  var button = document.getElementById("Save");
  var textbox = document.getElementById('Textbox');

  // Listener for Save button
  button.addEventListener("click", function (event) {
    var link = document.createElement('a');
    link.setAttribute('download', textbox.value);
    var data = [thetaList, transList];
    link.href = makeTextFile(data);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
  });
}

/***************************************************
  Load button listener
****************************************************/
function clickLoadButton() {
  var button = document.getElementById("Load");
  var list = document.getElementById("KeyFrameList");

  // Listener for Load button
  button.addEventListener("click", function (event) {
    if (!isFileExist) {
      alert("You have either selected the wrong file or did not select a file");
    } else {
      thetaList = loadedThetaList;
      transList = loadedTransList;

      for(var i = list.options.length - 1; i >= 0; i--)
        list.remove(i);
      
      for(var i = 0; i < thetaList.length; i++) {
        var keyframe = document.createElement("option");
        keyframe.text = "ThetaList: " + thetaList[i] +
                       " XYZ: " + transList[i];
        list.add(keyframe);
      }
    }
  });
}

/***************************************************
  Onchange event listener for taking file
****************************************************/
function chooseFile() {
  document.getElementById("File").onchange = function (e) {
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function (progressEvent) {
      document.getElementById("FileText").innerHTML = e.target.value.split('\\').pop();
      var data = this.result;
      var json = JSON.parse(data);

      loadedThetaList = json[0]
      loadedTransList = json[1];

      isFileExist = true;
    };
    reader.readAsText(file);
  };
}

/***************************************************
  Makes quadrilateral
****************************************************/
function quad(a, b, c, d) {
  vertices.push(cubeVertices[a]);
  vertices.push(cubeVertices[b]);
  vertices.push(cubeVertices[c]);
  vertices.push(cubeVertices[d]);
}

/***************************************************
  Simple cube creation with using quadrilaterals
****************************************************/
function cube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

/***************************************************
  Vertices for drawing a simple cube
****************************************************/
var cubeVertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0)
];

/***************************************************
  Vertex buffers without colors
****************************************************/
function processBuffers(vertices, vSize) {
  // Load the vertex data into the GPU
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, vSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
}

/***************************************************
  Vertex buffers with colors (Overload)
****************************************************/
function processBuffers(color, vertices, vSize) {
  var colors = [];
  
  // Create color array as much as vertices length
  for(var i = 0; i < vertices.length; i++)
    colors.push(color);

  // Load the color data into the GPU
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  // Associate out vertex color variables with our color buffer
  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  // Load the vertex data into the GPU
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, vSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
}


/************************************************************
  File creation (Modified)

  Taken from https://stackoverflow.com/questions/21012580/
    is-it-possible-to-write-data-to-file-using-only-javascript
*************************************************************/
var textFile = null,
  makeTextFile = function (data) {
    var data = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

/*******************************************************************
  Draggable UI Elements (Not modified)

  Taken from https://www.w3schools.com/howto/howto_js_draggable.asp
********************************************************************/
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}