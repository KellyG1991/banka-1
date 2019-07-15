const express = require('express');
const app = express();
const port = process.env.PORT || 1991;
require('./src/db');
const client = require('./routes/users/clientRt');
const transaction = require('./routes/transactionRt');
const staff = require('./routes/users/staffRt');
const morgan = require('morgan')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use('/api/v1/users', client);
app.use('/api/v1/transactions',transaction);
app.use('/api/v1/admin', staff);


app.listen(port, function(){
    console.log('\x1b[35m%s\x1b[0m','You are listening on port '+port+'.....');
})