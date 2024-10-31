var socket;
const globalServerPort = 3000;
var subServerName = '';

function setup(){
    createCanvas(600, 600);
    background(51);

    socket = io.connect('http://localhost:3000'); 

    // Adding an input (connection) field
    var input = createInput();
    input.position(10, height + 10);
    var connectButton = createButton('Connect');
    connectButton.position(input.x + input.width, height + 10);

    subServerName = 1;
    socket.emit('joinSubServer', subServerName);
    // Adding an clear button
    var clearButton = createButton('Clear');
    clearButton.position(connectButton.x + connectButton.width, height + 10);

    clearButton.mousePressed(function() {
        clearCanvas();
        socket.emit('clearCanvas', subServerName);
    });


    socket.on('mouse', newDrawing);  

    socket.on('syncCanvas', function(data) {
        // Convas update based on received data
        redrawCanvas(data);
    });

    socket.on('clearCanvas', ()=>{
        clearCanvas();
    });

}

function clearCanvas(){
    background(51);
}

function newDrawing(data){

    noStroke();
    fill(255);
    ellipse(data.x, data.y, 20, 20);
}

function mouseDragged(){
    var data = {
        x: mouseX,
        y: mouseY,
        subServerName: subServerName
    }
    socket.emit('mouse', data); 
    console.log('Sending: ' + data.x + ' ' + data.y + ' ' + data.subServerName);

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);
}