const express = require('express');
const app = express();
const port = process.env.PORT || 1991;
require('./src/db');
const user = require('./routes/userRt');
const transaction = require('./routes/transactionRt')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/v1/users', user);
app.use('/api/v1/transactions',transaction);


app.listen(port, function(){
    console.log('\x1b[35m%s\x1b[0m','You are listening on port '+port+'.....');
})