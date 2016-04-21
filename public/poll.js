function Poll (options) {
  this.pollName         = options.pollName || "Poll";
  this.pollChoices      = options.pollChoices;
  this.userVotes        = {};
  this.voteTally        = createTally(this.pollChoices);
  this.active           = true;
}

function createTally(pollChoices) {
  var voteTally = {};

  for (var choice in pollChoices) {
    voteTally[pollChoices[choice]] = 0;
  }

  return voteTally;
}

module.exports = Poll;
