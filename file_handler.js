var exportFile = function() {
    var filename = document.getElementById("export_file").value

    if (!filename) {
        filename = 'data'
    }

    var data = JSON.stringify(arrObjects);
    download(filename + ".json", data);

    console.log("The file was saved!"); 
}

var importFile = function() {
    var file = document.getElementById("import_file").files[0]
    var reader = new FileReader();
    // var data = [];
    reader.onload = function(e){
        console.log('file imported')
        arrObjects = JSON.parse(e.target.result);
        // console.log(data)
        // arrObjects = data
        renderAll()
    }
    
    reader.readAsText(file);
    if (!file) {
        alert('Blank file')
    }
}

var download = function(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}