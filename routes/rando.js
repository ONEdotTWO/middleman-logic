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
        members: members,
        messages: messages
      }, function (err) {
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
  var msg = {
    from: req.query.from,
    content: req.query.content
  };

  var query = {members: {$elemMatch: {number: msg.from}}};

  // find rando document for the 'from' number
  mongo.findOne(collectionName, query, function (err, doc, db) {
    if (!err && doc) {
      // pick a random 'to' number

      var filtered = doc.members.filter(function (member) {
        return member.number !== msg.from;
      });

      db.close();
      msg.to = filtered[randomInt(filtered.length)].number;

      // add msg to 'messages' array in mongo
      msg.pending = true;
      var update = {$push: {messages: msg}};

      mongo.updateOne(collectionName, doc, update, function (err, result, db) {
        db.close();
        if (!err) {
          res.send('msg handled')
        } else {
          res.status(500).send(err.message);
        }
      });

    } else if (!doc) {
      db.close();
    } else {
      res.status(500).send(err.message);
    }
  })
});

router.post('/send-edit', function (req, res) {

  var msg = {
    to: req.body.to,
    from: req.body.from,
    content: req.body.content
  };

  // get latest message
  var filter = { messages: {$elemMatch: {pending: true, to: msg.to, from: msg.from}}};
  var update = {$set: {"messages.$.pending": false, "messages.$.content": msg.content}};
  mongo.updateOne(collectionName, filter, update, function (err, result, db) {
    db.close();
    if (!err) {
      sms.send(msg, function (err) {
        if (!err) {
          res.send('msg handled')
        } else {
          res.status(500).send(err.message);
        }
      });
    } else {
      res.status(500).send(err.message);
    }
  });
});

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;