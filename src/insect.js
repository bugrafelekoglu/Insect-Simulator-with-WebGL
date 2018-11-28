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
var vBuffer;

// Global variables
var isFileExist = false;
var projectionMatrix;
var instanceMatrix;
var modelViewMatrix;
var modelViewMatrixLoc;

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0)
];

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

var numNodes = 15; 

var bodyHeight = 1.6;
var bodyWidth = 1.2;
var headHeight = 1.6;
var headWidth = 1.8;
var rearHeight = 2.2;
var rearWidth = 2.2;
var legHeight = 3.0;
var legWidth = 0.3;

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

var stack = [];
var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

var pointsArray = [];

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function fillLists() {
  thetaList = [
    [-110, 0, -150, 70, -240, 60, 230, -90, 150, -100, 0, 0, 0, 0, 0],
    [-110, 0, -240, 70, -140, 60, 140, -90, 230, -100, 0, 0, 0, 0, 0],
    [-110, 0, -190, 30, -200, 20, 160, -40, 190, -70, 0, 0, 0, 0, 0],
    [-110, 0, -190, 30, -200, 20, 180, -20, 170, -30, 0, 0, 0, 0, 0],
    [-110, 0, -190, 30, -200, 20, 190, -10, 180, -10, 0, 0, 0, 0, 0],
    [-110, 0, -190, 30, -200, 20, 220, -80, 210, -70, 0, 0, 0, 0, 0],
    [-110, 0, -130, 30, -240, 20, 220, -60, 150, -70, 0, 0, 0, 0, 0],
    [-110, 0, -240, 30, -100, 20, 150, -60, 230, -70, 0, 0, 0, 0, 0],
    [-110, 0, -100, 30, -240, 20, 220, -60, 150, -80, 0, 0, 0, 0, 0],
    [-110, 0, -100, 30, -240, 20, 220, -60, 150, -80, 0, 0, 0, 0, 0]
  ];

  transList = [
    [-3.1, -2.8, -1.6],
    [-1, -2.8, -1.6],
    [0, 0, -1.6],
    [0.9, 3, -1.6],
    [1.5, -1.2, -1.6],
    [1.5, -2.8, -1.6],
    [1.5, -1.6, -1.6],
    [3.7, -1.6, -1.6],
    [5, -1.6, -1],
    [5, -1.6, -1]
  ]
}

function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  }
  return node;
}

function initNodes(Id) {

  var m = mat4();

  switch (Id) {
    case bodyId:
      m = translate(-curTranslateX, curTranslateY, curTranslateZ);
      m = mult(m, rotate(curTheta[bodyId], 0, 1, 0));
      m = mult(m, rotate(-90, 0, 0, 1));
      figure[bodyId] = createNode(m, body, null, headId);
      break;

    case headId:
      m = translate(0.0, 0.8 * bodyHeight, 0.0);
      m = mult(m, rotate(curTheta[headId], 0, 0, 1));
      m = mult(m, translate(0.0, -0.8 * bodyHeight, 0.0));
      figure[headId] = createNode(m, head, rearId, null);
      break;

    case rearId:
      m = translate(-0.2, -bodyHeight, 0.0);
      m = mult(m, rotate(curTheta[rearId], 0, 0, 1));
      m = mult(m, translate(0.2, bodyHeight, 0.0));
      figure[rearId] = createNode(m, rear, leftFrontUpperLegId, null);
      break;

    case leftFrontUpperLegId:
      m = translate(0.0, 0.0, 0.0);
      m = mult(m, rotate(curTheta[leftFrontUpperLegId], 0, 0, 1));
      figure[leftFrontUpperLegId] = createNode(m, leftFrontUpperLeg, leftCenterUpperLegId, leftFrontLowerLegId);
      break;

    case leftCenterUpperLegId:
      //m = translate(-(bodyWidth + legWidth) / 2, rearHeight, 0.0);
      //m = mult(m, rotate(curTheta[leftCenterUpperLegId], 1, 0, 0));
      //m = mult(m, rotate(15, 0, 0, 1));
      figure[leftCenterUpperLegId] = createNode(m, leftCenterUpperLeg, leftBackUpperLegId, leftCenterLowerLegId);
      break;

    case leftBackUpperLegId:
      //m = translate(-(bodyWidth + legWidth) / 2, rearHeight, 0.0);
      //m = mult(m, rotate(curTheta[leftBackUpperLegId], 1, 0, 0));
      //m = mult(m, rotate(15, 0, 0, 1));
      figure[leftBackUpperLegId] = createNode(m, leftBackUpperLeg, rightFrontUpperLegId, leftBackLowerLegId);
      break;

    case rightFrontUpperLegId:
      //m = translate(-(bodyWidth + legWidth) / 2, rearHeight, 0.0);
      //m = mult(m, rotate(curTheta[rightFrontUpperLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[rightFrontUpperLegId] = createNode(m, rightFrontUpperLeg, rightCenterUpperLegId, rightFrontLowerLegId);
      break;

    case rightCenterUpperLegId:
      //m = translate(-(bodyWidth + legWidth) / 2, rearHeight, 0.0);
      //m = mult(m, rotate(curTheta[rightCenterUpperLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[rightCenterUpperLegId] = createNode(m, rightCenterUpperLeg, rightBackUpperLegId, rightCenterLowerLegId);
      break;

    case rightBackUpperLegId:
      //m = translate(-(bodyWidth + legWidth) / 2, rearHeight, 0.0);
      //m = mult(m, rotate(curTheta[rightBackUpperLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[rightBackUpperLegId] = createNode(m, rightBackUpperLeg, null, rightBackLowerLegId);
      break;

    case leftFrontLowerLegId:
      //m = translate(0.0, legHeight, 0.0);
      //m = mult(m, rotate(curTheta[leftFrontLowerLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[leftFrontLowerLegId] = createNode(m, leftFrontLowerLeg, null, null);
      break;

    case leftCenterLowerLegId:
      //m = translate(0.0, legHeight, 0.0);
      //m = mult(m, rotate(curTheta[leftCenterLowerLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[leftCenterLowerLegId] = createNode(m, leftCenterLowerLeg, null, null);
      break;

    case leftBackLowerLegId:
      //m = translate(0.0, legHeight, 0.0);
     // m = mult(m, rotate(curTheta[leftBackLowerLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[leftBackLowerLegId] = createNode(m, leftBackLowerLeg, null, null);
      break;

    case rightFrontLowerLegId:
      //m = translate(0.0, legHeight, 0.0);
      //m = mult(m, rotate(curTheta[rightFrontLowerLegId], 1, 0, 0));
      //m = mult(m, rotate(-15, 0, 0, 1));
      figure[rightFrontLowerLegId] = createNode(m, rightFrontLowerLeg, null, null);
      break;

    case rightCenterLowerLegId:
      //m = translate(0.0, legHeight, 0.0);
      //m = mult(m, rotate(curTheta[rightCenterLowerLegId], 1, 0, 0));
     // m = mult(m, rotate(-15, 0, 0, 1));
      figure[rightCenterLowerLegId] = createNode(m, rightCenterLowerLeg, null, null);
      break;

    case rightBackLowerLegId:

      m = translate(-0.55, -2.2, 4.2);
      m = mult(m, rotate(-60, 1, 0, 0));
      m = mult(m, translate(0.0, legHeight/2, 0.0));
      m = mult(m, rotate(30, 0, 0, 1));
      m = mult(m, translate(0.0, -legHeight/2, 0.0));
      m = mult(m, rotate(curTheta[rightBackLowerLegId], 0, 0, 1));
      m = mult(m, translate(0.0, legHeight/2, 0.0));
      m = mult(m, rotate(-30, 0, 0, 1));
      m = mult(m, translate(0.0, -legHeight/2, 0.0));
      m = mult(m, rotate(60, 1, 0, 0));
      m = mult(m, translate(0.55, 2.2, -4.2));

      /*
      m = translate(0.55, 2.2, -4.2);
      m = mult(m, rotate(60, 1, 0, 0));
      m = mult(m, translate(0.0, -legHeight/2, 0.0));
      m = mult(m, rotate(-30, 0, 0, 1));
      m = mult(m, translate(0.0, legHeight/2, 0.0));
      m = mult(m, rotate(curTheta[rightBackLowerLegId], 0, 1, 0));
      m = mult(m, translate(0.0, -legHeight/2, 0.0));
      m = mult(m, rotate(30, 0, 0, 1));
      m = mult(m, translate(0.0, legHeight/2, 0.0));
      m = mult(m, rotate(-60, 1, 0, 0));
      m = mult(m, translate(-0.55, -2.2, 4.2));
      */

      figure[rightBackLowerLegId] = createNode(m, rightBackLowerLeg, null, null);
      break;
  }
}

function traverse(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function body() {
  instanceMatrix = mult(modelViewMatrix, scale4(bodyWidth, bodyHeight, bodyWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function head() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.8 * bodyHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rear() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.2, -bodyHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(rearWidth, rearHeight, rearWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function leftFrontUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.8, -1.8));
  instanceMatrix = mult(instanceMatrix, rotate(120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function leftCenterUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, -1.8));
  instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function leftBackUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.8, -1.8));
  instanceMatrix = mult(instanceMatrix, rotate(60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rightFrontUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.8, 1.8));
  instanceMatrix = mult(instanceMatrix, rotate(-120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rightCenterUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 1.8));
  instanceMatrix = mult(instanceMatrix, rotate(-90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rightBackUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.8, 1.8));
  instanceMatrix = mult(instanceMatrix, rotate(-60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(-10, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function leftFrontLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 2.2, -4.2));
  instanceMatrix = mult(instanceMatrix, rotate(120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function leftCenterLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 0.0, -4.55));
  instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function leftBackLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, -2.2, -4.2));
  instanceMatrix = mult(instanceMatrix, rotate(60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rightFrontLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 2.2, 4.2));
  instanceMatrix = mult(instanceMatrix, rotate(-120, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rightCenterLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, 0.0, 4.55));
  instanceMatrix = mult(instanceMatrix, rotate(-90, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function rightBackLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.55, -2.2, 4.2));
  instanceMatrix = mult(instanceMatrix, rotate(-60, 1, 0, 0));
  instanceMatrix = mult(instanceMatrix, translate(0.0, legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, rotate(30, 0, 0, 1));
  instanceMatrix = mult(instanceMatrix, translate(0.0, -legHeight/2, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  drawBodyPart();
}

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  pointsArray.push(vertices[b]);
  pointsArray.push(vertices[c]);
  pointsArray.push(vertices[d]);
}

function cube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

function drawBodyPart() {
  for(var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

var timet;
var timetLoc;
var isRunning = false;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) alert("WebGL isn't available");

  // Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  dragElement(document.getElementById("UIButtons"));
  dragElement(document.getElementById("UISliders"));

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.width);
  gl.clearColor(0, 0.69, 0.94, 1.0);
  gl.enable(gl.DEPTH_TEST);

  instanceMatrix = mat4();
  timet = 0;
  translateZ = 0;
  translateY = 0;
  translateX = 0;

  projectionMatrix = perspective(90, 1, 0.02, 200);
  modelViewMatrix = lookAt(vec3(0, 4, -10), vec3(0, 1, 0), vec3(0, 1, 0));
  //modelViewMatrix = lookAt(vec3(0, 3, -10), vec3(0, 2, 0), vec3(0, 1, 0));

  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  timetLoc = gl.getUniformLocation(program, "timet");

  cube();

  vBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  clickAnimationButton();
  clickSaveButton();
  clickLoadButton();
  chooseFile();
  sliders();

  for (i = 0; i < numNodes; i++) initNodes(i);
  render();
};

var interpolationFrame = 0;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (isRunning) {
    if (timet < 1) {
      timet += 0.01;
    } else {
      //next keyframe
      interpolationFrame = (interpolationFrame + 1) % thetaList.length;
      timet = 0;
    }

    var curFrame = interpolationFrame;
    var nextFrame = (interpolationFrame + 1) % thetaList.length;

    for (var i = 0; i < theta.length; i++) {
      curTheta[i] = thetaList[curFrame][i] * (1 - timet) + thetaList[nextFrame][i] * timet;
      initNodes(i);
    }

    curTranslateX = transList[curFrame][0] * (1 - timet) + transList[nextFrame][0] * timet;
    curTranslateY = transList[curFrame][1] * (1 - timet) + transList[nextFrame][1] * timet;
    curTranslateZ = transList[curFrame][2] * (1 - timet) + transList[nextFrame][2] * timet;
    initNodes(bodyId);
  } else {
    for (var i = 0; i < theta.length; i++) {
      curTheta[i] = theta[i];
      initNodes(i);
    }

    curTranslateX = translateX;
    curTranslateY = translateY;
    curTranslateZ = translateZ;
    initNodes(bodyId);
  }

  gl.uniform1f(timetLoc, timet);
  traverse(bodyId);
  requestAnimFrame(render);
}

function sliders() {
  document.getElementById("sliderBody").oninput = function() {
    theta[bodyId] = event.srcElement.value;    
    initNodes(bodyId);
  };

  document.getElementById("sliderHead").oninput = function() {
    theta[headId] = event.srcElement.value;
    initNodes(headId);
  };

  document.getElementById("sliderRear").oninput = function() {
    theta[rearId] = event.srcElement.value;
    initNodes(rearId);
  };

  document.getElementById("sliderLFU").oninput = function() {
    theta[leftFrontUpperLegId] = event.srcElement.value;
    initNodes(leftFrontUpperLegId);
  };

  document.getElementById("sliderLFL").oninput = function() {
    theta[leftFrontLowerLegId] =  event.srcElement.value;
    initNodes(leftFrontLowerLegId);
  };

  document.getElementById("sliderLCU").oninput = function() {
    theta[leftCenterUpperLegId] = event.srcElement.value;
    initNodes(leftCenterUpperLegId);
  };

  document.getElementById("sliderLCL").oninput = function() {
    theta[leftCenterLowerLegId] = event.srcElement.value;
    initNodes(leftCenterLowerLegId);
  };

  document.getElementById("sliderLBU").oninput = function() {
    theta[leftBackUpperLegId] = event.srcElement.value;
    initNodes(leftBackUpperLegId);
  };

  document.getElementById("sliderLBL").oninput = function() {
    theta[leftBackLowerLegId] = event.srcElement.value;
    initNodes(leftBackLowerLegId);
  };

  document.getElementById("sliderRFU").oninput = function() {
    theta[rightFrontUpperLegId] = event.srcElement.value;
    initNodes(rightFrontUpperLegId);
  };

  document.getElementById("sliderRFL").oninput = function() {
    theta[rightFrontLowerLegId] =  event.srcElement.value;
    initNodes(rightFrontLowerLegId);
  };

  document.getElementById("sliderRCU").oninput = function() {
    theta[rightCenterUpperLegId] = event.srcElement.value;
    initNodes(rightCenterUpperLegId);
  };

  document.getElementById("sliderRCL").oninput = function() {
    theta[rightCenterLowerLegId] = event.srcElement.value;
    initNodes(rightCenterLowerLegId);
  };

  document.getElementById("sliderRBU").oninput = function() {
    theta[rightBackUpperLegId] = event.srcElement.value;
    initNodes(rightBackUpperLegId);
  };

  document.getElementById("sliderRBL").oninput = function() {
    theta[rightBackLowerLegId] = event.srcElement.value;
    initNodes(rightBackLowerLegId);
  };

  document.getElementById("sliderX").oninput = function() {
    translateX = event.srcElement.value;
    initNodes(bodyId);
  };

  document.getElementById("sliderY").oninput = function() {
    translateY = event.srcElement.value;
    initNodes(bodyId);
  };

  document.getElementById("sliderZ").oninput = function() {
    translateZ = event.srcElement.value;
    initNodes(bodyId);
  };
}


/***************************************************
  Animation button listener
****************************************************/
function clickAnimationButton() {
  var generate = document.getElementById("Animation");

  // Listener for Animation button
  generate.addEventListener("click", function () {
    fillLists();
    isRunning = !isRunning;
    timet = 0;
  });
}

/***************************************************
  Save button listener
****************************************************/
function clickSaveButton() {
  var save = document.getElementById("Save");
  var textbox = document.getElementById('Textbox');

  // Listener for Save button
  save.addEventListener("click", function (event) {
    var link = document.createElement('a');
    link.setAttribute('download', textbox.value);
    var data = [n, houseColors, houseFloors, clouds];
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
  var load = document.getElementById("Load");

  // Listener for Load button
  load.addEventListener("click", function (event) {
    if (!isFileExist) {
      alert("You have either selected the wrong file or did not select a file");
    } else {

    }

    render();
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

      loadedN = json[0]
      loadedHouseColors = json[1];
      loadedHouseFloors = json[2];
      loadedClouds = json[3];

      isFileExist = true;
    };
    reader.readAsText(file);
  };
}

/***************************************************
  Color and Vertex buffers
****************************************************/
function processBuffers(colors, vertices) {
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
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
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