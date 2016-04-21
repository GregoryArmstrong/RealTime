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
const Poll = require('./public/poll.js');

var votes = {};
var userVotes = {};
app.locals.polls = {};

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

app.get('/poll/:id', function (request, response) {
  var currentPoll = app.locals.polls[request.params.id];

  response.render('vote', { votes: currentPoll.voteTally, title: "Vote" });
});

app.get('/poll/admin/:id', function (request, response) {
  var poll = app.locals.polls[request.params.id];

  response.sendFile(__dirname + '/public/admin_poll.html');
});

io.on('connection', function (socket){
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      var currentPoll = app.locals.polls[message.pollName];
      currentPoll.userVotes[socket.id] = message.vote;

      io.sockets.emit('voteCount', countVotes(currentPoll.voteTally, currentPoll.userVotes));
    }

    if (channel === 'newPollOptions') {
      var newPoll = new Poll(message);

      app.locals.polls[newPoll.pollName] = newPoll;
      console.log(app.locals.polls);
      setPollClose(newPoll);
      io.sockets.emit('newPoll', newPoll);
    }

    if (channel === 'pollClose') {
      var currentPoll = app.locals.polls[message.pollName];

      currentPoll.active = false;
      io.sockets.emit('pollClosed', currentPoll);
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnection', io.engine.clientsCount);
  });
});

function setPollClose(poll) {
  setTimeout(function() {
    poll.active = false;
    io.sockets.emit('pollClosed', poll);
  }, poll.duration);
}

function countVotes(voteTally, userVotes) {
  var voteCount = {};
  var keys = Object.keys(voteTally);

  keys.forEach( (key) => {
    voteCount[key] = 0;
  });

  for (var vote in userVotes) {
    voteCount[userVotes[vote]]++;
  }

  return voteCount;
}

module.exports = server;
