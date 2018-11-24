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

// Global variables
var isFileExist = false;
var projectionMatrix;
var instanceMatrix;
var modelViewMatrix;
var modelViewMatrixLoc;

// Constant color values
const SKY_COLOR = vec4(0, 176, 240, 255);
const GROUND_COLOR = vec4(23, 198, 40, 255);
const SPIDER_COLOR = vec4(60, 60, 60, 255);

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  clickGenerateButton();
  clickSaveButton();
  clickLoadButton();
  chooseFile();
  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

}

/***************************************************
  Generate button listener
****************************************************/
function clickGenerateButton() {
  var generate = document.getElementById("Generate");

  // Listener for Generate button
  generate.addEventListener("click", function() {

  } );
}

/***************************************************
  Save button listener
****************************************************/
function clickSaveButton() {
  var save = document.getElementById("Save");
  var textbox = document.getElementById('Textbox');

  // Listener for Save button
  save.addEventListener("click", function(event) {
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
    } );
  } );
}

/***************************************************
  Load button listener
****************************************************/
function clickLoadButton() {
  var load = document.getElementById("Load");

  // Listener for Load button
  load.addEventListener("click", function(event) {
    if(!isFileExist) {
      alert("You have either selected the wrong file or did not select a file");
    }
    else {

    }

    render();
  } );
}

/***************************************************
  Onchange event listener for taking file
****************************************************/
function chooseFile() {
  document.getElementById("File").onchange = function (e) {
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function (progressEvent) {
      document.getElementById("FileText").innerHTML  = e.target.value.split('\\').pop();
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

function drawGround() {
  drawRectangle(vec2(-1, -0.30), vec2(1, -1), GROUND_COLOR, GROUND);
}

function drawSky() {
  drawRectangle(vec2(-1, 1), vec2(1, -1), SKY_COLOR, SKY);
}

/***************************************************
  Generic circle draw function

  Param:
    center: center point for circle
    radius: radius of circle
    color1: center color for circle
    color2: additional sphere color for circle
    depth: z value of circle
****************************************************/
function drawCircle(center, radius, color1, color2, depth) {
  var polyCount = 32;
  var vertices = [];
  var colors = [];
  var i;

  vertices.push(vec3(center[0], center[1], depth));
  for(i = 0; i < polyCount + 1; i++) {
    var x = radius * Math.cos(i * 2 * Math.PI / polyCount) + center[0];
    var y = radius * Math.sin(i * 2 * Math.PI / polyCount) + center[1];
    vertices.push(vec3(x, y, depth));
  }

  colors.push(vec4(color1));
  for(i = 0; i < polyCount + 1; i++) {
    colors.push(vec4(color2));
  }

  processBuffers(colors, vertices);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, polyCount + 2);
}

/***************************************************
  Generic triangle draw function

  Param:
    pos1: first vertex position
    pos2: second vertex position
    pos3: third vertex position
    color: color of triangle vertices
    depth: z value of triangle
****************************************************/
function drawTriangle(pos1, pos2, pos3, color, depth) {
  var vertices = [
    vec3(pos1[0], pos1[1], depth),
    vec3(pos2[0], pos2[1], depth),
    vec3(pos3[0], pos3[1], depth)
  ];

  var colors = [
    color,
    color,
    color
  ];

  processBuffers(colors, vertices);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/***************************************************
  Generic rectangle draw function

  Param:
    pos1: left top vertex position
    pos2: right bottom vertex position
    color: color of rectangle vertices
    depth: z value of rectangle
****************************************************/
function drawRectangle(pos1, pos2, color, depth) {
  // Vertices of rectangle
  var vertices = [
    vec3(pos1[0], pos2[1], depth),
    vec3(pos1[0], pos1[1], depth),
    vec3(pos2[0], pos1[1], depth),
    vec3(pos2[0], pos2[1], depth)
  ];

  // Colors of rectangle
  var colors = [
    color,
    color,
    color,
    color
  ];

  processBuffers(colors, vertices);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

/***************************************************
  Color and Vertex buffers
****************************************************/
function processBuffers(colors, vertices) {
  // Load the color data into the GPU
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer );
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
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
}

/************************************************************
  File creation (Modified)

  Taken from https://stackoverflow.com/questions/21012580/
    is-it-possible-to-write-data-to-file-using-only-javascript
*************************************************************/
var textFile = null,
  makeTextFile = function (data) {
    var data = new Blob([JSON.stringify(data)], {type: 'application/json'});

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
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
