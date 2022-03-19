var vertexShaderText = 
    'attribute vec3 position;'+
    'uniform mat4 Pmatrix;'+
    'uniform mat4 Vmatrix;'+
    'uniform mat4 Mmatrix;'+
    'uniform vec4 translation;'+
    'attribute vec3 color;'+//the color of the point
    'varying vec3 vColor;'+
    'void main(void) { '+//pre-built function
    'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.) + translation;'+
    'vColor = color;'+
    '}'

var fragmentShaderText = 
    'precision mediump float;'+
    'varying vec3 vColor;'+
    'void main(void) {'+
    'gl_FragColor = vec4(vColor, 1.);'+
    '}';

var createShader = function(type, source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader!', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return
    }
    return shader
}

var createProgram = function(vertexShader, fragmentShader) {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program!', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program!', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    return program
}

var drawObject = function (program, vertices, colors, indices, n, PMatrix, VMatrix, MMatrix, position) {
    // Create and store data into vertex buffer
    var vertex_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create and store data into color buffer
    var color_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Create and store data into index buffer
    var index_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    var _Pmatrix = gl.getUniformLocation(program, "Pmatrix");
    var _Vmatrix = gl.getUniformLocation(program, "Vmatrix");
    var _Mmatrix = gl.getUniformLocation(program, "Mmatrix");
    var translation = gl.getUniformLocation(program, 'translation');
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var _position = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_position);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    var _color = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(_color);
	gl.useProgram(program)

    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // gl.clearDepth(1.0);
    // gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(_Pmatrix, false, PMatrix);
    gl.uniformMatrix4fv(_Vmatrix, false, VMatrix);
    gl.uniformMatrix4fv(_Mmatrix, false, MMatrix);
    gl.uniform4f(translation, position[0], position[1], position[2], 0.0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}


var load = function() {
    if (!gl) {
        console.log('webgl not supported')
        gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

    init()
    //main(arrObjects[0].vertice,arrObjects[0].color, arrObjects[0].indice, arrObjects[0].n,arrObjects[0].PMatrix,arrObjects[0].VMatrix,arrObjects[0].MMatrix)
    renderAll()
}

var main = function (vertices, colors, indices, n, pMatrix, vMatrix, mMatrix,position) {
    console.log('Main is working')

    // Create Shaders
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderText)
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderText)

    // Create program
    var program = createProgram(vertexShader, fragmentShader)

    drawObject(program, vertices, colors, indices, n, pMatrix, vMatrix, mMatrix,position)
}

var init = function (){
    initCube(1,0.05); //Objek pertama adalah kubus pada posisi 0,0,0
    //initCube2();
}

var rotateX= function(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;

    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
    return m;
}

var rotateY = function(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];

    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
    return m;
 }

var get_projection = function(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
       0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
       ];
}

var changeCube = function(){
    let rotX = document.getElementById('cubeRotX').value;
    let rotY = document.getElementById('cubeRotY').value;
    let scale = document.getElementById('cubeScale').value;
    let m_matrix = mo_matrix
    m_matrix = rotateY(m_matrix,rotY)
    m_matrix = rotateX(m_matrix,rotX)
    var vert_temp = getCubeVertices(0,0,0,scale/10,0.05)


    arrObjects[0].vertice = vert_temp
    arrObjects[0].MMatrix = m_matrix
    vertices=[]
    // main(arrObjects[0].vertice,arrObjects[0].color, arrObjects[0].indice, arrObjects[0].n)
    renderAll()
}


//canvas
var canvas = document.getElementById('canvas-surface')
var gl = canvas.getContext('webgl')

var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
const mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
var view_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];

view_matrix[14] = view_matrix[14]-6;;

// Mouse Position
var x = 0
var y = 0
var width = document.getElementById('canvas-surface').width
var height = document.getElementById('canvas-surface').height



// Vertices and color
var vertices = []
var colors = []
var indices = []
var points = []
var rgb = [0.0, 0.0, 0.0]

// Array of Object
var arrObjects = []

var renderAll = function() {
    for (var i=0; i<arrObjects.length; i++) {
        main(arrObjects[i].vertice,arrObjects[i].color, arrObjects[i].indice, arrObjects[i].n,arrObjects[i].PMatrix,arrObjects[i].VMatrix,arrObjects[i].MMatrix,arrObjects[0].position)
    }
}
