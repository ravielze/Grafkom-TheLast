var initCube = function(s,t){
    vertices_temp = getCubeVertices(0,0,0,s,t/2);
    colors_temp = getCubeColors();
    indices_temp = getCubeIndices();
    let proMatrix = getProjectionMatrix(40, canvas.width/canvas.height, 1, 100);
    let mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
    let view_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
    view_matrix[14] = view_matrix[14]-6;
    let posisi = [0,0,0]; //tetapkan 0,0,0 sebagai posisi kubus
    arrObjects.push({
        vertice: vertices_temp,
        color: colors_temp,
        indice: indices_temp,
        n: indices_temp.length,
        PMatrix: proMatrix,
        VMatrix: view_matrix,
        MMatrix: mo_matrix,
        position: posisi
    })
    console.log(arrObjects)
    vertices_temp = []
    colors_temp = []
    indices_temp = []
}


var getProjectionMatrix = function(angle, a, zMin, zMax){
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
        0.5/ang, 0 , 0, 0,
        0, 0.5*a/ang, 0, 0,
        0, 0, -(zMax+zMin)/(zMax-zMin), -1,
        0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
        ];
}

var getCubeVertices = function(x, y, z, s, t) {
    return [
        //Depan
        //A-B
        //Depan
        x + s/2 + t, y + s/2 + t, z + s/2 + t, 
        x + s/2 + t, y + s/2 - t, z + s/2 + t,
        x + s/2 + t, y + s/2 - t, z - s/2 - t,
        x + s/2 + t, y + s/2 + t, z - s/2 - t,
        //Atas
        x + s/2 - t, y + s/2 + t, z + s/2 + t,
        x + s/2 + t, y + s/2 + t, z + s/2 + t,
        x + s/2 + t, y + s/2 + t, z - s/2 - t,
        x + s/2 - t, y + s/2 + t, z - s/2 - t,
        //Belakang
        x + s/2 - t, y + s/2 + t, z + s/2 + t,
        x + s/2 - t, y + s/2 - t, z + s/2 + t,
        x + s/2 - t, y + s/2 - t, z - s/2 - t,
        x + s/2 - t, y + s/2 + t, z - s/2 - t,
        //Bawah
        x + s/2 - t, y + s/2 - t, z + s/2 + t,
        x + s/2 + t, y + s/2 - t, z + s/2 + t,
        x + s/2 + t, y + s/2 - t, z - s/2 - t,
        x + s/2 - t, y + s/2 - t, z - s/2 - t,

        //B-C
        //Depan
        x + s/2 + t, y + s/2 + t, z - s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 - t,
        x + s/2 + t, y + s/2 + t, z - s/2 - t,
        //Kanan
        x + s/2 + t, y + s/2 + t, z - s/2 - t,
        x + s/2 + t, y - s/2 - t, z - s/2 - t,
        x + s/2 - t, y - s/2 - t, z - s/2 - t,
        x + s/2 - t, y + s/2 + t, z - s/2 - t,
        //Belakang
        x + s/2 - t, y + s/2 + t, z - s/2 + t,
        x + s/2 - t, y - s/2 - t, z - s/2 + t,
        x + s/2 - t, y - s/2 - t, z - s/2 - t,
        x + s/2 - t, y + s/2 + t, z - s/2 - t,
        //Kiri
        x + s/2 + t, y + s/2 + t, z - s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 + t,
        x + s/2 - t, y - s/2 - t, z - s/2 + t,
        x + s/2 - t, y + s/2 + t, z - s/2 + t,

        //A-D
        //Depan
        x + s/2 + t, y + s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 - t,
        x + s/2 + t, y + s/2 + t, z + s/2 - t,
        //Kanan
        x + s/2 + t, y + s/2 + t, z + s/2 - t,
        x + s/2 + t, y - s/2 - t, z + s/2 - t,
        x + s/2 - t, y - s/2 - t, z + s/2 - t,
        x + s/2 - t, y + s/2 + t, z + s/2 - t,
        //Belakang
        x + s/2 - t, y + s/2 + t, z + s/2 + t,
        x + s/2 - t, y - s/2 - t, z + s/2 + t,
        x + s/2 - t, y - s/2 - t, z + s/2 - t,
        x + s/2 - t, y + s/2 + t, z + s/2 - t,
        //Kiri
        x + s/2 + t, y + s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 + t,
        x + s/2 - t, y - s/2 - t, z + s/2 + t,
        x + s/2 - t, y + s/2 + t, z + s/2 + t,

        //C-D
        //Depan
        x + s/2 + t, y - s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 - t,
        x + s/2 + t, y - s/2 + t, z - s/2 - t,
        //Atas
        x + s/2 - t, y - s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 + t, z - s/2 - t,
        x + s/2 - t, y - s/2 + t, z - s/2 - t,
        //Belakang
        x + s/2 - t, y - s/2 + t, z + s/2 + t,
        x + s/2 - t, y - s/2 - t, z + s/2 + t,
        x + s/2 - t, y - s/2 - t, z - s/2 - t,
        x + s/2 - t, y - s/2 + t, z - s/2 - t,
        //Bawah
        x + s/2 - t, y - s/2 - t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 - t,
        x + s/2 - t, y - s/2 - t, z - s/2 - t,

        //Belakang
        //E-F
        //Depan
        x - s/2 + t, y + s/2 + t, z + s/2 + t, 
        x - s/2 + t, y + s/2 - t, z + s/2 + t,
        x - s/2 + t, y + s/2 - t, z - s/2 - t,
        x - s/2 + t, y + s/2 + t, z - s/2 - t,
        //Atas
        x - s/2 - t, y + s/2 + t, z + s/2 + t,
        x - s/2 + t, y + s/2 + t, z + s/2 + t,
        x - s/2 + t, y + s/2 + t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 - t,
        //Belakang
        x - s/2 - t, y + s/2 + t, z + s/2 + t,
        x - s/2 - t, y + s/2 - t, z + s/2 + t,
        x - s/2 - t, y + s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 - t,
        //Bawah
        x - s/2 - t, y + s/2 - t, z + s/2 + t,
        x - s/2 + t, y + s/2 - t, z + s/2 + t,
        x - s/2 + t, y + s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 - t, z - s/2 - t,

        //F-G
        //Depan
        x - s/2 + t, y + s/2 + t, z - s/2 + t,
        x - s/2 + t, y - s/2 - t, z - s/2 + t,
        x - s/2 + t, y - s/2 - t, z - s/2 - t,
        x - s/2 + t, y + s/2 + t, z - s/2 - t,
        //Kanan
        x - s/2 + t, y + s/2 + t, z - s/2 - t,
        x - s/2 + t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 - t,
        //Belakang
        x - s/2 - t, y + s/2 + t, z - s/2 + t,
        x - s/2 - t, y - s/2 - t, z - s/2 + t,
        x - s/2 - t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 - t,
        //Kiri
        x - s/2 + t, y + s/2 + t, z - s/2 + t,
        x - s/2 + t, y - s/2 - t, z - s/2 + t,
        x - s/2 - t, y - s/2 - t, z - s/2 + t,
        x - s/2 - t, y + s/2 + t, z - s/2 + t,

        //E-H
        //Depan
        x - s/2 + t, y + s/2 + t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z + s/2 - t,
        x - s/2 + t, y + s/2 + t, z + s/2 - t,
        //Kanan
        x - s/2 + t, y + s/2 + t, z + s/2 - t,
        x - s/2 + t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y + s/2 + t, z + s/2 - t,
        //Belakang
        x - s/2 - t, y + s/2 + t, z + s/2 + t,
        x - s/2 - t, y - s/2 - t, z + s/2 + t,
        x - s/2 - t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y + s/2 + t, z + s/2 - t,
        //Kiri
        x - s/2 + t, y + s/2 + t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z + s/2 + t,
        x - s/2 - t, y - s/2 - t, z + s/2 + t,
        x - s/2 - t, y + s/2 + t, z + s/2 + t,

        //G-H
        //Depan
        x - s/2 + t, y - s/2 + t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z - s/2 - t,
        x - s/2 + t, y - s/2 + t, z - s/2 - t,
        //Atas
        x - s/2 - t, y - s/2 + t, z + s/2 + t,
        x - s/2 + t, y - s/2 + t, z + s/2 + t,
        x - s/2 + t, y - s/2 + t, z - s/2 - t,
        x - s/2 - t, y - s/2 + t, z - s/2 - t,
        //Belakang
        x - s/2 - t, y - s/2 + t, z + s/2 + t,
        x - s/2 - t, y - s/2 - t, z + s/2 + t,
        x - s/2 - t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 + t, z - s/2 - t,
        //Bawah
        x - s/2 - t, y - s/2 - t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z + s/2 + t,
        x - s/2 + t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 - t, z - s/2 - t,

        //Penghubung depan dan belakang
        //F-B
        //Kanan
        x + s/2 + t, y + s/2 + t, z - s/2 - t,
        x + s/2 + t, y + s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 - t,
        //Kiri
        x + s/2 + t, y + s/2 + t, z - s/2 + t,
        x + s/2 + t, y + s/2 - t, z - s/2 + t,
        x - s/2 - t, y + s/2 - t, z - s/2 + t,
        x - s/2 - t, y + s/2 + t, z - s/2 + t,
        //Atas
        x + s/2 + t, y + s/2 + t, z - s/2 + t,
        x + s/2 + t, y + s/2 + t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 - t,
        x - s/2 - t, y + s/2 + t, z - s/2 + t,
        //Bawah
        x + s/2 + t, y + s/2 - t, z - s/2 + t,
        x + s/2 + t, y + s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 - t, z - s/2 - t,
        x - s/2 - t, y + s/2 - t, z - s/2 + t,

        //G-C
        //Kanan
        x + s/2 + t, y - s/2 + t, z - s/2 - t,
        x + s/2 + t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 + t, z - s/2 - t,
        //Kiri
        x + s/2 + t, y - s/2 + t, z - s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 + t,
        x - s/2 - t, y - s/2 - t, z - s/2 + t,
        x - s/2 - t, y - s/2 + t, z - s/2 + t,
        //Atas
        x + s/2 + t, y - s/2 + t, z - s/2 + t,
        x + s/2 + t, y - s/2 + t, z - s/2 - t,
        x - s/2 - t, y - s/2 + t, z - s/2 - t,
        x - s/2 - t, y - s/2 + t, z - s/2 + t,
        //Bawah
        x + s/2 + t, y - s/2 - t, z - s/2 + t,
        x + s/2 + t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 - t, z - s/2 - t,
        x - s/2 - t, y - s/2 - t, z - s/2 + t,

        //E-A
        //Kanan
        x + s/2 + t, y + s/2 + t, z + s/2 - t,
        x + s/2 + t, y + s/2 - t, z + s/2 - t,
        x - s/2 - t, y + s/2 - t, z + s/2 - t,
        x - s/2 - t, y + s/2 + t, z + s/2 - t,
        //Kiri
        x + s/2 + t, y + s/2 + t, z + s/2 + t,
        x + s/2 + t, y + s/2 - t, z + s/2 + t,
        x - s/2 - t, y + s/2 - t, z + s/2 + t,
        x - s/2 - t, y + s/2 + t, z + s/2 + t,
        //Atas
        x + s/2 + t, y + s/2 + t, z + s/2 + t,
        x + s/2 + t, y + s/2 + t, z + s/2 - t,
        x - s/2 - t, y + s/2 + t, z + s/2 - t,
        x - s/2 - t, y + s/2 + t, z + s/2 + t,
        //Bawah
        x + s/2 + t, y + s/2 - t, z + s/2 + t,
        x + s/2 + t, y + s/2 - t, z + s/2 - t,
        x - s/2 - t, y + s/2 - t, z + s/2 - t,
        x - s/2 - t, y + s/2 - t, z + s/2 + t,

        //H-D
        //Kanan
        x + s/2 + t, y - s/2 + t, z + s/2 - t,
        x + s/2 + t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y - s/2 + t, z + s/2 - t,
        //Kiri
        x + s/2 + t, y - s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 + t,
        x - s/2 - t, y - s/2 - t, z + s/2 + t,
        x - s/2 - t, y - s/2 + t, z + s/2 + t,
        //Atas
        x + s/2 + t, y - s/2 + t, z + s/2 + t,
        x + s/2 + t, y - s/2 + t, z + s/2 - t,
        x - s/2 - t, y - s/2 + t, z + s/2 - t,
        x - s/2 - t, y - s/2 + t, z + s/2 + t,
        //Bawah
        x + s/2 + t, y - s/2 - t, z + s/2 + t,
        x + s/2 + t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y - s/2 - t, z + s/2 - t,
        x - s/2 - t, y - s/2 - t, z + s/2 + t,
    ]
}

var getCubeColors = function(){
    return [
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,

        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0
     ];
}

var getCubeIndices = function(){
    return [
        0,1,2, 0,2,3, 4,5,6, 4,6,7,
        8,9,10, 8,10,11, 12,13,14, 12,14,15,
        16,17,18, 16,18,19, 20,21,22, 20,22,23,
        24,25,26, 24,26,27, 28,29,30, 28,30,31,
        32,33,34, 32,34,35, 36,37,38, 36,38,39,
        40,41,42, 40,42,43, 44,45,46, 44,46,47,
        48,49,50, 48,50,51, 52,53,54, 52,54,55,
        56,57,58, 56,58,59, 60,61,62, 60,62,63,

        64,65,66, 64,66,67, 68,69,70, 68,70,71,
        72,73,74, 72,74,75, 76,77,78, 76,77,79,
        80,81,82, 80,82,83, 84,85,86, 84,86,87,
        88,89,90, 88,90,91, 92,93,94, 92,94,95,
        96,97,98, 96,98,99, 100,101,102, 100,102,103,
        104,105,106, 104,106,107, 108,109,110, 108,110,111,
        112,113,114, 112,114,115, 116,117,118, 116,118,119,
        120,121,122, 120,122,123, 124,125,126, 124,126,127,

        128,129,130, 128,130,131, 132,133,134, 132,134,135,
        136,137,138, 136,138,139, 140,141,142, 140,142,143,
        144,145,146, 144,146,147, 148,149,150, 148,150,151,
        152,153,154, 152,154,155, 156,157,158, 156,158,159,
        160,161,162, 160,162,163, 164,165,166, 164,166,167,
        168,169,170, 168,170,171, 172,173,174, 172,174,175,
        176,177,178, 176,178,179, 180,181,182, 180,182,183,
        184,185,186, 184,186,187, 188,189,190, 188,190,191 
     ];
}

var changeScaleX = function(){
    Sx = document.getElementById("scale-x").value
}

var fixSquare = function (vertice , idx, x, y){
    vertice[idx * 5] = x
    vertice[idx * 5 + 1] = y 
    if (idx == 0){
        vertice[5] = vertice[10]
        vertice[6] = y
        vertice[15] = x
        vertice[16] = vertice[11]
    }else if (idx == 1){
        vertice[0] = vertice [15]
        vertice[1] = y
        vertice[10] = x
        vertice[11] = vertice[16]
    }else if(idx == 2){
        vertice[5] = x
        vertice[6] = vertice[1]
        vertice[15] = vertice[0]
        vertice[16] = y
    }else{
        vertice[0] = x
        vertice[1] = vertice[6]
        vertice[10] = vertice[5]
        vertice[11] = y
    }
    return vertice
}

var fixPoints = function(vertice){
    for (var i=0; i<vertice.length; i+=5) {
        var sq_point = getSquarePoint(vertice[i], vertice[i+1])
        points.push(sq_point)
    }
}

var changeScaleY = function(){
    Sy = document.getElementById("scale-y").value
}