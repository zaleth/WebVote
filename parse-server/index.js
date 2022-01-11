
var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();
var admin = new ParseServer({
  databaseURI: 'mongodb://127.0.0.1:27017/parse',
  cloud: './cloud/main.js',
  appId: 'WebVote',

  masterKey: 'WebVoteMasterKey'
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', admin);

var adminPort = 1337;
app.listen(adminPort, function() {
  console.log('parse-server-admin running on port ' + adminPort + '.');
});
