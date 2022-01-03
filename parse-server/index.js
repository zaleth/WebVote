
var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();
var admin = new ParseServer({
  databaseURI: 'mongodb://127.0.0.1:27017/parse',
  cloud: './cloud/main.js',
  appId: 'WebVoteAdmin',
  masterKey: 'WebVoteMasterKey'
});

var office = new ParseServer({
  databaseURI: 'mongodb://127.0.0.1:27017/parse',
  cloud: './cloud/main.js',
  appId: 'WebVoteOffice',
  masterKey: 'WebVoteMasterKey'
});


var voter = new ParseServer({
  databaseURI: 'mongodb://127.0.0.1:27017/parse',
  cloud: './cloud/main.js',
  appId: 'WebVoteVoter',
  masterKey: 'WebVoteMasterKey'
});
// Serve the Parse API at /parse URL prefix
app.use('/parse', admin);
app.use('/office', office);
app.use('/voter', voter);

var adminPort = 1337;
app.listen(adminPort, function() {
  console.log('parse-server-admin running on port ' + adminPort + '.');
});

var officePort = 1338;
app.listen(officePort, function() {
  console.log('parse-server-office running on port ' + officePort + '.');
});

var port = 1339;
app.listen(port, function() {
  console.log('parse-server-voter running on port ' + port + '.');
});