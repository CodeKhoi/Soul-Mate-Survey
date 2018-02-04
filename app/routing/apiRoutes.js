var friends = require('../data/friends.js');

module.exports = function (app) {
  app.get('/api/friends', function (req,res) {
      res.json(friends);
  });

  app.post('/api/friends', function (req, res) {
      // userInput is the user that filled out the survey
      var userInput = req.body;

      // Ge best match from scores
      var optimalMatch = {};

      for(var i = 0; i < userInput.scores.length; i++) {
        if(userInput.scores[i] == "1 (Strongly Disagree)") {
          userInput.scores[i] = 1;
        } else if(userInput.scores[i] == "5 (Strongly Agree)") {
          userInput.scores[i] = 5;
        } else {
          userInput.scores[i] = parseInt(userInput.scores[i]);
        }
      }

      // Compares scores of user input to friends array
      var optimalMatchIndex = 0;
      var optimalMatchVariance = 40;

      for(var i = 0; i < friends.length; i++) {
        var totalVariance = 0;

        for(var index = 0; index < friends[i].scores.length; index++) {
          var absoluteValue = Math.abs(friends[i].scores[index] - userInput.scores[index]);
          totalVariance += absoluteValue;
        }

        if (totalVariance < optimalMatchVariance) {
          optimalMatchIndex = i;
          optimalMatchVariance = totalVariance;
        }
      }
      optimalMatch = friends[optimalMatchIndex];
      friends.push(userInput);
      res.json(optimalMatch);
  });

};
