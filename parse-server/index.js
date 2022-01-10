
var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();
var admin = new ParseServer({
  databaseURI: 'mongodb://admin:IX2zH7D3DGmkp8wEel1rte3Y@MongoS3601A.back4app.com:27017/0936202593d54bb2be2566adbbea1000',
  cloud: './cloud/main.js',
  appId: 'VavejCBuFbWSwByr9TY4PpKjheKBbH2EEMxaT9sQ',
  javascriptKey: '4lY78FyWcoy9ctT6JCWqakt9BtXxQAzGO2zqJz23',
  masterKey: 'NvVKghs2I2O9zC9twmvZTo4roP01JvNJ6zprrOuf'
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', admin);

var adminPort = 1337;
app.listen(adminPort, function() {
  console.log('parse-server-admin running on port ' + adminPort + '.');
});
