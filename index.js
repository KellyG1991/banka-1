const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const user = require('./routes/user');


if(!config.get('jwtKey')){
    console.log('Error Please enter jwtKey');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/banka_DB', {useNewUrlParser: true})
    .then(() => console.log('\x1b[34m%s\x1b[0m','MongoDB is connected....'))
    .catch(err => console.error('\x1b[31m%s\x1b[0m', err.message));

mongoose.set('useFindAndModify',false);

app.use(express.json());
app.use(express.urlencoded());
app.use('/api/users', user);


const port = process.env.PORT || 1991
app.listen(port, function(){
    console.log('\x1b[35m%s\x1b[0m','You are listening on port '+port+'......');
})

