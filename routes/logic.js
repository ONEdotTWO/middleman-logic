var express = require('express');
var request=require("request");
var router = express.Router();
var fs = require('fs');
var http = require('http');

/* GET home page. */
router.post('/', function (req, res) {

    // Load configuration
    var configuration = JSON.parse(
        fs.readFileSync("bin/config.json")
    );

    if(configuration.mode == "middleman")
    {
        console.log("Mode == middleman");
        var content=req.body.content;
        var to=req.body.to;
        var from=req.body.from;

        // If message contains # at start then take first token as 'to' number
        if(content.substr(0,1) == "#")
        {
            var send_to = content.substr(1,12);
            var from = configuration.middleman_number;
            var message = content.substr(13);

            request.get("http://ec2-52-17-7-182.eu-west-1.compute.amazonaws.com:4000/sender-sms?to="+send_to+"&from="+from+"&content="+message,function(error,response,body){
                if(error){
                    console.log(error);
                }
            });
        } else {
            var send_to = configuration.default_receiver;
            var from = configuration.middleman_number;
            var message = content;

            request.get("http://ec2-52-17-7-182.eu-west-1.compute.amazonaws.com:4000/sender-sms?to="+send_to+"&from="+from+"&content="+message,function(error,response,body){
                if(error){
                    console.log(error);
                }
            });
        }
        res.json({});
    }
});

module.exports = router;
