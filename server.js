
//////////////////////////////////
// Require Native Node.js Libraries
//////////////////////////////////

var express = require('express');
var app = express();
var http = require('http');
http = http.Server(app);
var io = require('socket.io');
io = io(http);
var currentPlayerID = 0;
var players = [];
var playerObject = {x: 20, y: 20, currentPlayerID: 0};
playerObject.velocity = { x: 0, y: 0 };
playerObject.onFloor = false;

//////////////////////////////////
// Route our Assets
//////////////////////////////////

app.use('/assets/', express.static(__dirname + '/public/assets/'));

//////////////////////////////////
// Route our Home Page
//////////////////////////////////

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

//////////////////////////////////
// Handle Socket Connection
//////////////////////////////////

io.on('connection', function(socket){

  console.log('A User Connected');

  //changes the next players ID to a new one
  playerObject.currentPlayerID = currentPlayerID;

  //add player to array
  players.push(playerObject);

  //emit to the client their id
  io.emit('connected', currentPlayerID);

  socket.on('updatePlayer', function(clientPlayer, clientID){
    for(var i = 0; i < players.length; i++) {
      if ( clientID = players[i].currentPlayerID ) {
          players[i].x = clientPlayer.x;
          players[i].y = clientPlayer.y; 
      }
      io.emit('renderPlayers', players);
    }
  })

  socket.on('disconnect', function(id) {

    console.log('Got disconnect! ');
    //remove player that disconnected
    for(var i = 0; i < players.length; i++) {
      if(id == players[i].currentPlayerID){
        var playerIndex = players.indexOf(i);
        players.splice(playerIndex, 1);
      }
    }
  });

  //change next players ID
  currentPlayerID = currentPlayerID + 1;

  //changes the next players ID to a new one
  playerObject.currentPlayerID = currentPlayerID;
});

  
//////////////////////////////////
// Start Server
//////////////////////////////////

http.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function(){
  var addr = http.address();
  console.log("Server started at", addr.address + ":" + addr.port);
});
