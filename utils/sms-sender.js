var request = require('request');
var config = require('../config/app-config');

var senderUrlBase = "http://" + config.hostname + ":" + config.senderPort + "/sender-sms";

var exports = {
  send: function (msg, callback) {
    request.get(senderUrlBase + "?to=" + msg.to + "&from=" + msg.from + "&content=" + msg.content,
        function (err) {
          callback(err);
        }
    );
  }
};

module.exports = exports;
module.exports.senderUrlBase = senderUrlBase;