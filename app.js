var vertexShaderText = 
    `precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 1.0);
    }`

var fragmentShaderText = 
    `precision mediump float;
    
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }`

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

var drawObject = function (program, vertices, colors, indices, n) {
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
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var _position = gl.getAttribLocation(program, "vertPosition");
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_position);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    var _color = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(_color);

	// Main render loop
	gl.useProgram(program)

    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // gl.clearDepth(1.0);
    // gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
    main(arrObjects[0].vertice,arrObjects[0].color, arrObjects[0].indice, arrObjects[0].n)
}

var main = function (vertices, colors, indices, n) {
    console.log('Main is working')

    // Create Shaders
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderText)
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderText)

    // Create program
    var program = createProgram(vertexShader, fragmentShader)

    drawObject(program, vertices, colors, indices, n)
}

var init = function (){
    initCube();
}

var rotateX = function(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[0][1], mv5 = m[1][1], mv9 = m[2][1];

    m[0][1] = m[0][1]*c-m[0][2]*s;
    m[1][1] = m[1][1]*c-m[1][2]*s;
    m[2][1] = m[2][1]*c-m[2][2]*s;

    m[0][2] = m[0][2]*c+mv1*s;
    m[1][2] = m[1][2]*c+mv5*s;
    m[2][2] = m[2][2]*c+mv9*s;
    return m;
}

var rotateY = function(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0][0], mv4 = m[1][0], mv8 = m[2][0];

    m[0][0] = c*m[0][0]+s*m[0][2];
    m[1][0] = c*m[1][0]+s*m[1][2];
    m[2][0] = c*m[2][0]+s*m[2][2];

    m[0][2] = c*m[0][2]-s*mv0;
    m[1][2] = c*m[1][2]-s*mv4;
    m[2][2] = c*m[2][2]-s*mv8;
    return m;
}

var get_projection = function(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
       [0.5/ang, 0 , 0, 0],
       [0, 0.5*a/ang, 0, 0],
       [0, 0, -(zMax+zMin)/(zMax-zMin), -1],
       [0, 0, (-2*zMax*zMin)/(zMax-zMin), 0] 
       ];
}

var changeCube = function(){
    var rotX = document.getElementById('cubeRotX').value;
    var rotY = document.getElementById('cubeRotY').value;
    var scale = document.getElementById('cubeScale').value;
    let m_matrix = mo_matrix
    m_matrix = rotateY(m_matrix,rotY)
    m_matrix = rotateX(m_matrix,rotX)
    var vert_temp = getCubeVertices(0,0,0,scale/10)
    for (let i=0; i<vert_temp.length/3;i++){
        var v4Matrix = [vert_temp[i*3],vert_temp[i*3+1],vert_temp[i*3+2],1]
        // var result = changeObjectVertice(proj_matrix,view_matrix,m_matrix,v4Matrix)
        let result = matrix41Mult(m_matrix,v4Matrix)
        for(let j=0;j<v4Matrix.length-1;j++){
            vertices.push(result[j])
        }
    }

    arrObjects[0].vertice = vertices
    vertices=[]
    // main(arrObjects[0].vertice,arrObjects[0].color, arrObjects[0].indice, arrObjects[0].n)
    renderAll()
}

var matrix44Mult = function(mat1, mat2){
    let temp = new Array(4)
    for(let i=0;i<temp.length;i++){
        temp[i] = new Array(4)
    }
    for(let i=0; i<4;i++){
        for(let j=0; j<4;j++){
            temp[i][j] = 0
            for(let k=0; k<4;k++){
                temp[i][j] = temp[i][j] + mat1[i][k]*mat2[k][j];
                
            }
        }
    }
    return temp
}

var matrix41Mult = function(mat1, mat2){
    let temp=[]
    for(let i=0; i<4;i++){
        let val_temp =0
        for(let j=0; j<4;j++){
            val_temp += mat1[i][j]*mat2[j]
        }
        temp.push(val_temp)
    }
    return temp
}

var changeObjectVertice = function(mat1,mat2,mat3,mat4){
    var res1 = matrix44Mult(mat1,mat2)
    var res2 = matrix44Mult(res1,mat3)
    var result = matrix41Mult(res2,mat4)
    return result
}

//canvas
var canvas = document.getElementById('canvas-surface')
var gl = canvas.getContext('webgl')

var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
var mo_matrix = [ [1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]];
var view_matrix = [ [1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1] ];

view_matrix[3][2] = view_matrix[3][2]-6;

// Mouse Position
var x = 0
var y = 0
var width = document.getElementById('canvas-surface').width
var height = document.getElementById('canvas-surface').height

// For Object selected
var selectedObject
var idxPoint
var isDrag = false



// Vertices and color
var vertices = []
var colors = []
var indices = []
var points = []
var rgb = [0.0, 0.0, 0.0]

// Array of Object
var arrObjects = []

canvas.addEventListener("mousedown", function(e) {
    x = getXCursorPosition(canvas, e)
    y = getYCursorPosition(canvas, e)   
    // console.log('x : '+ x + ' y : ' + y)
    checkSelectedObject(x, y)
    render(x, y)

    if (selectedObject != null) {
        isDrag = true
        canvas.addEventListener("mouseup", (event) => changeObjectPoint(canvas, event))

        if(!isDrag) {
            canvas.removeEventListener("mouseup", (event) => changeObjectPoint(canvas, event))
        }
    }
})

var render = function(x, y) {
    if (isPolygon) {
        drawPolygon(x, y)
    } else if (isLine) {
       drawLine(x, y)
    } else if (isSquare) {
        drawSquare(x, y)
    }
}

var renderObject = function(vertices, n, method) {
    main(vertices, n, method)
    for (var i=0; i<vertices.length; i+=5) {
        var sq_point = getSquarePoint(vertices[i], vertices[i+1])
        main(sq_point, 4, gl.TRIANGLE_FAN)
        points.push(sq_point)
    }
    console.log("render object")
    console.log(points)
}

var renderAll = function() {
    for (var i=0; i<arrObjects.length; i++) {
        main(arrObjects[i].vertice, arrObjects[i].color, arrObjects[i].indice,arrObjects[i].n)
    }
}


var getXCursorPosition = function(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    return (x - width/2)/ (width/2);
}

var getYCursorPosition  = function(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top
    return (y - height/2)/ (height/2) * -1;
}

var checkSelectedObject = function(x, y) {
    selectedObject = null
    idxPoint = -1

    arrObjects.forEach(function (item) {
        item.p.forEach(function (item2, idx) {
            // console.log("item2")
            // console.log(item2)
            if (x > item2[0] && y < item2[1] &&
                x < item2[5] && y < item2[6] &&
                x < item2[10] && y > item2[11] &&
                x > item2[15] && y > item2[16]) {
                selectedObject = item
                idxPoint = idx
                console.log("object selected with idx " + idx)
            }
        })
    })
    // console.log(selectedObject)
}

var changeObjectPoint = function(canvas, ev) {
    x = getXCursorPosition(canvas, ev)
    y = getYCursorPosition(canvas, ev)
        
    if (isDrag && selectedObject.type != "square") {
        // change vertices point
        selectedObject.vert[idxPoint*5] = x
        selectedObject.vert[idxPoint*5 + 1] = y

        // change square point
        selectedObject.p[idxPoint] = getSquarePoint(x, y)
        renderAll()
        isDrag = false
    }else if(isDrag && selectedObject.type == "square"){
        selectedObject.vert = fixSquare(selectedObject.vert,idxPoint,x,y)
        fixPoints(selectedObject.vert)
        selectedObject.p = points
        points = []
        renderAll()
        isDrag = false
    }
}

var getSquarePoint = function(x, y) {
    return [
        x-0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y-0.025, 1.0, 1.0, 1.0,
        x-0.025, y-0.025, 1.0, 1.0, 1.0
    ]
}