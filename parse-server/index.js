
import '../settings';

var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();
var api = new ParseServer({
  databaseURI: DATABASE_URI,
  cloud: './cloud/main.js',
  appId: APP_ID,
  javascriptKey: JS_KEY,
  masterKey: MARSTER_KEY
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

app.listen(PARSE_PORT, function() {
  console.log('parse-server running on port ' + PARSE_PORT + '.');
});
