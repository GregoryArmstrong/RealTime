const http = require('http');
const express = require('express');
const app = express();
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function() {
                   console.log('Listening on port ' + port + '.');
                 });
const io = socketIo(server);
const bodyParser = require('body-parser');

var votes = {};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket){
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes));
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    io.sockets.emit('usersConnection', io.engine.clientsCount);
  });
});

function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };

  for (var vote in votes) {
    voteCount[votes[vote]]++;
  }
  return voteCount;
}

module.exports = server;
