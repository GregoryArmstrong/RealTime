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
                         pollDuration: grabValue('poll-option-timer'),
                       };

  submitPollButton.addEventListener('click', function(event) {
    event.preventDefault;
    socket.send('newPollOptions', newPollOptions);
  });
}

socket.on('newPoll', function (newPoll) {
  var adminPollView = document.getElementById('admin-poll-view');
  var clientPollView = document.getElementById('client-poll-view');

  adminPollView.innerHTML = '<a href= "/poll/admin/' + newPoll.pollName + '">Admin View</a>';
  clientPollView.innerHTML = '<a href= "/poll/' + newPoll.pollName + '">Client View</a>';
});

function grabValue(id) {
  return document.getElementById(id).value;
}
