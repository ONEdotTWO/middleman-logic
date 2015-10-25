var request = require('request');
var config = require('../config/app-config');

var senderUrlBase = "http://" + config.hostname + ":" + config.senderPort + "/sender-sms";

var exports = {
  send: function (msg, callback) {
    request.get(senderUrlBase + "?to=" + msg.to + "&from=" + msg.from + "&content=" + msg.content,
        function (err, resp) {

          if (resp.statusCode != 200) {
            callback(Error("SMS sender returned response status: " + resp.statusCode
                + ": " + JSON.stringify(resp.body)));
          } else {
            callback();
          }
        }
    );
  }
};

module.exports = exports;
module.exports.senderUrlBase = senderUrlBase; // does this do anything?