require('./src/logging')();
const express = require('express');
const app = express();
require('./src/config')();
require('./src/db');
require('./src/routes')(app);



module.exports = app;

