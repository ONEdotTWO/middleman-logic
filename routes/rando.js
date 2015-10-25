var express = require('express');
var router = express.Router();
var mongo = require('../utils/mongo');
var sms = require('../utils/sms-sender');

var collectionName = "randos";

/* handle POST to start rando */
router.post('/start', function (req, res) {

  var members = req.body.members;
  var to = members[randomInt(members.length)]
  var messages = [{
    to: to.number,
    from: "",
    content: "hello " + to.name + ".. regards, rando"
  }];

  sms.send(messages[0], function (err) {
    if (!err) {
      mongo.save(collectionName, {
        members : members,
        messages : messages
      }, function(err) {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.send('started rando instance');
        }
      });
    } else {
      res.status(500).send(err.message);
    }
  })

});

router.get('/receive-sms', function (req, res) {
  var msg = JSON.stringify({
    'from': req.query.from,
    'content': req.query.content
  });

  var query = { members : { $elemMatch : { number : msg.from } } };

  // find rando ID for the 'from' number
  mongo.findOne(collectionName, query, function (err, doc) {
    if (!err) {

    }
  })
  // pick random number from members
  // forward message to number
  // add 'to' to msg
  // write to database
});

function randomInt (max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;