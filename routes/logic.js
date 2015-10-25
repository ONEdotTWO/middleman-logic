var express = require('express');
var request=require("request");
var router = express.Router();
var fs = require('fs');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.post('/', function (req, res) {

    // Load configuration
    var configuration = JSON.parse(
        fs.readFileSync("bin/config.json")
    );

    console.log("Mode == " + configuration.mode);


    if(configuration.mode == "middleman")
    {
        var content=req.body.content;
        var to=req.body.to;
        var from=req.body.from;

        // If message contains # at start then take first token as 'to' number
        if(content.substr(0,1) == "#")
        {
            var send_to = content.substr(1,12);
            var send_from = configuration.middleman_number;
            var message = content.substr(13);

            request.get("http://ec2-52-17-7-182.eu-west-1.compute.amazonaws.com:4000/sender-sms?to="+send_to+"&from="+send_from+"&content="+message,function(error,response,body){
                if(error){
                    console.log(error);
                } else {
                    MongoClient.connect(configuration.MONGO_URI, function (err, db) {
                        if (!err) {
                            var collection = db.collection('messages');
                            var document = {'to': send_to, 'from': from, 'message': message, 'original':'true', 'plugin':'middleman'};
                            collection.insert(document, {w: 1}, function (err, result) {
                                if (err) {
                                    console.log("Couldn't send to database");
                                }
                            });
                        } else {
                            console.log("ERROR: Couldn't connect to remote mongo");
                        }
                    });

                }
            });
        } else {
            var send_to = configuration.default_receiver;
            var send_from = configuration.middleman_number;
            var message = content;

            request.get("http://ec2-52-17-7-182.eu-west-1.compute.amazonaws.com:4000/sender-sms?to="+send_to+"&from="+send_from+"&content="+message,function(error,response,body){
                if(error){
                    console.log(error);
                } else {
                    MongoClient.connect(configuration.MONGO_URI, function (err, db) {
                        if (!err) {
                            var collection = db.collection('messages');
                            var document = {'to': send_to, 'from': from, 'message': message, 'original':'true', 'plugin':'middleman'};
                            collection.insert(document, {w: 1}, function (err, result) {
                                if (err) {
                                    console.log("Couldn't send to database");
                                }
                            });
                        } else {
                            console.log("ERROR: Couldn't connect to remote mongo");
                        }
                    });
                }
            });
        }
        res.json({});
    } else if(configuration.mode == "random") {

        // Get message and headers
        var content=req.body.content;
        var from=req.body.from;

        // Get random address != from field
        var user_array = configuration.users;
        user_array.splice(user_array.indexOf(from),1);

        // Send message to random
        var to=user_array[Math.floor(Math.random() * user_array.length)];

        request.get("http://ec2-52-17-7-182.eu-west-1.compute.amazonaws.com:4000/sender-sms?to="+to+"&from="+from+"&content="+content,function(error,response,body){
            if(error){
                console.log(error);
            } else {
                MongoClient.connect(configuration.MONGO_URI, function (err, db) {
                    if (!err) {
                        var collection = db.collection('messages');
                        var document = {'to': to, 'from': from, 'message': content, 'original':'true', 'plugin':'random'};
                        collection.insert(document, {w: 1}, function (err, result) {
                            if (err) {
                                console.log("Couldn't send to database");
                            }
                        });
                    } else {
                        console.log("ERROR: Couldn't connect to remote mongo");
                    }
                });
            }
        });
        res.json({});
    }
});

module.exports = router;
