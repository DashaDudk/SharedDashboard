var express = require('express');
var app = express();

// Port for root server
var rootServerPort = 3000;
var rootServer = app.listen(rootServerPort);

app.use(express.static('public')); 

console.log("Global socket server is running on port " + rootServerPort);

var canvasData = {}; 

var socket = require('socket.io');

var io = socket(rootServer);

io.sockets.on('connection', newConnection); 

function newConnection(socket){

    socket.on('joinSubServer', (subServerName) => {
        const rooms = socket.adapter.sids.get(socket.id);

        rooms.forEach((room) => {
            if (room !== socket.id){
                socket.leave(room);
            }
        });
        // Joining the room
        socket.join(subServerName);
        // Sending convas status to a new user
        if (canvasData[subServerName]) {
            socket.emit('syncCanvas', canvasData[subServerName]);
        }
        else{
            socket.emit('syncCanvas', []);
        }
    });

    socket.on('mouse', mouseMsg); 

    function mouseMsg(data){

        const { x, y, subServerName } = data;
        if (!canvasData[subServerName]) {
            canvasData[subServerName] = [];
        }
        canvasData[subServerName].push({ x, y });

        socket.to(subServerName).emit('mouse', data);
    }

    socket.on('clearCanvas', (subServerName)=>{
        canvasData[subServerName] = [];
        io.to(subServerName).emit('clearCanvas');
    });
}