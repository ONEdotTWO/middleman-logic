var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {

    // Load configuration
    var configuration = JSON.parse(
        fs.readFileSync(configFile)
    );

    if(configuration.mode == "middleman")
    {
        // Get message
        // If message contains # at start then take first token as 'to' number
        // Send to number using sender
        // If message doesn't contain # at start
        // Send to middleman number
    }
});

module.exports = router;
