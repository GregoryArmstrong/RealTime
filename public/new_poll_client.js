var socket = io();

var submitPollButton = document.getElementById('poll-option-submit');

if (submitPollButton) {
  var newPollOptions = { pollName: grabValue('poll-name'),
                         pollChoices: {
                                        pollChoiceOne: grabValue('poll-option-1'),
                                        pollChoiceTwo: grabValue('poll-option-2'),
                                        pollChoiceThree: grabValue('poll-option-3'),
                                        pollChoiceFour: grabValue('poll-option-4')
                                      },
                       };
  // var newPollOptions = [grabValue('poll-option-1'),
  //                       grabValue('poll-option-2'),
  //                       grabValue('poll-option-3'),
  //                       grabValue('poll-option-4')];

  submitPollButton.addEventListener('click', function(event) {
    event.preventDefault;
    socket.send('newPollOptions', newPollOptions);
  });
}

function grabValue(id) {
  return document.getElementById(id).value;
}
