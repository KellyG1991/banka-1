const app = require('./app');

const port = process.env.PORT || 1991;
const winston = require('winston');

app.listen(port, function(){
    winston.info('\x1b[35m%s\x1b[0m','You are listening on port '+port+'.....');
})

