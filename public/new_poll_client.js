var socket = io();

var submitPollButton = document.getElementById('poll-option-submit');

if (submitPollButton) {
  // var pollOptionOne = grabValue('poll-option-1');
  // var pollOptionTwo = grabValue('poll-option-2');
  // var pollOptionThree = grabValue('poll-option-3');
  // var pollOptionFour = grabValue('poll-option-4');
  var newPollOptions = [grabValue('poll-option-1'),
                        grabValue('poll-option-2'),
                        grabValue('poll-option-3'),
                        grabValue('poll-option-4')];

  submitPollButton.addEventListener('click', function() {
    socket.send('newPollOptions', newPollOptions);
  });
}

function grabValue(id) {
  return document.getElementById(id).value;
}
