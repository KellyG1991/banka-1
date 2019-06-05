const express = require('express');
const app = express();
const user = require('./routes/user');
const login = require('./routes/login')
const mongoose = require('mongoose');
const config = require('config');


if(!config.get('jwtPrivateKey')){
    console.error('Error: Please Enter a jwtPrivateKey');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/BANKA',{useNewUrlParser:true})
    .then(() => console.log('\x1b[35m%s\x1b[0m','MongoDB is connected....'))
    .catch(err => console.error('\x1b[32m%s\x1b[0m', err.details[0].message));

mongoose.set('useFindAndModify',false);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/users', user);
app.use('/api/logins', login);




const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('\x1b[35m%s\x1b[0m','You are listening on port '+port+'......');
})