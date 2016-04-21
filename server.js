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
var userVotes = {};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/new_poll', function (request, response) {
  response.sendFile(__dirname + '/public/new_poll.html');
});

app.get('/vote', function (request, response) {
  response.render('vote', { votes: votes, title: "Vote" })
})

io.on('connection', function (socket){
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      userVotes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes, userVotes));
    }

    if (channel === 'newPollOptions') {
      votes = {};
      message.forEach( (poll) => {
        votes[poll] = 0;
      });
      console.log(votes);
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete userVotes[socket.id];
    socket.emit('voteCount', countVotes(votes, userVotes));
    io.sockets.emit('usersConnection', io.engine.clientsCount);
  });
});

function countVotes(votes, userVotes) {
  var voteCount = {};
  var keys = Object.keys(votes);

  keys.forEach( (key) => {
    voteCount[key] = 0;
  });

  for (var vote in userVotes) {
    voteCount[userVotes[vote]]++;
  }

  return voteCount;
}

module.exports = server;
