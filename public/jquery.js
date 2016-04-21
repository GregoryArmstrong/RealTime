submitPollButton.addEventListener('click', function() {
  console.log(pollOptions);
  socket.send('newPollOptions', pollOptions);
});
