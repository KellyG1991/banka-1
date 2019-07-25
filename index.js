require('./src/logging')();
const express = require('express');
const app = express();
require('./src/config')();
require('./src/db');
require('./src/routes')(app);

const port = process.env.PORT || 1991;
const winston = require('winston');

const server = app.listen(port, function(){
    winston.info('\x1b[35m%s\x1b[0m','You are listening on port '+port+'.....');
})

module.exports = server;

