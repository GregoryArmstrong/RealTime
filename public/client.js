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
    socket.send('voteCast', this.innerText);
    var currentVote = document.getElementById('vote-tallies-current');

    currentVote.innerText = this.innerText;
  });
}

socket.on('voteCount', function (votes) {
  var aTally = document.getElementById('vote-tallies-A');
  var bTally = document.getElementById('vote-tallies-B');
  var cTally = document.getElementById('vote-tallies-C');
  var dTally = document.getElementById('vote-tallies-D');

  aTally.innerText = "A: " + votes['A'];
  bTally.innerText = "B: " + votes['B'];
  cTally.innerText = "C: " + votes['C'];
  dTally.innerText = "D: " + votes['D'];
});
