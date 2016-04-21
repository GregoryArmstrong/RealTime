var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('userConnection', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', { pollName: 'test', vote: this.innerText});
    var currentVote = document.getElementById('vote-tallies-current');

    currentVote.innerText = this.innerText;
  });
}

socket.on('pollClosed', function () {
  var buttons = document.querySelectorAll('#choices button');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
});

socket.on('voteCount', function (votes) {
  var votesArray = Object.keys(votes);
  var aTally = document.getElementById('vote-tallies-1');
  var bTally = document.getElementById('vote-tallies-2');
  var cTally = document.getElementById('vote-tallies-3');
  var dTally = document.getElementById('vote-tallies-4');

  aTally.innerText = votesArray[0] + ": " + votes[votesArray[0]];
  bTally.innerText = votesArray[1] + ": " + votes[votesArray[1]];
  cTally.innerText = votesArray[2] + ": " + votes[votesArray[2]];
  dTally.innerText = votesArray[3] + ": " + votes[votesArray[3]];
});

var closePollButton = document.getElementById('close-poll');
closePollButton.addEventListener('click', function () {
  socket.send('pollClose', { pollName: 'test' });
});
