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
  var pollName = document.querySelector('h1').innerText;

  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', { pollName: pollName, vote: this.innerText});
    var currentVote = document.getElementById('vote-tallies-current');

    currentVote.innerText = this.innerText;
  });
}

socket.on('pollClosed', function (currentPoll) {
  var buttons = document.querySelectorAll('#choices button');
  var pollActive = document.getElementById('poll-active');
  var closePollButton = document.getElementById('close-poll');
  var pollName = document.querySelector('h2').innerText;

  if (currentPoll.pollName === pollName) {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
    pollActive.innerText = 'Closed';
    closePollButton.disabled = true;
  }
});

socket.on('voteCount', function (votes) {
  var votesArray = Object.keys(votes);
  var oneTally = document.getElementById('vote-tallies-1');
  var twoTally = document.getElementById('vote-tallies-2');
  var threeTally = document.getElementById('vote-tallies-3');
  var fourTally = document.getElementById('vote-tallies-4');

  oneTally.innerText   = votesArray[0] + ": " + votes[votesArray[0]];
  twoTally.innerText   = votesArray[1] + ": " + votes[votesArray[1]];
  threeTally.innerText = votesArray[2] + ": " + votes[votesArray[2]];
  fourTally.innerText  = votesArray[3] + ": " + votes[votesArray[3]];
});

var closePollButton = document.getElementById('close-poll');
  closePollButton.addEventListener('click', function () {
    var pollName = document.querySelector('h2').innerText;

    var pollInfo = { pollName: pollName }

    socket.send('pollClose', pollInfo);
});
