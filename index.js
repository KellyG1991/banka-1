const express = require('express');
const app = express();
const admin = require('./routes/admin');
const user = require('./routes/user');
const login = require('./routes/login');
const account = require('./routes/createAccount');
const deposit = require('./routes/deposit');
const mongoose = require('mongoose');
const config = require('config');



if(!config.get('jwtPrivateKey') || !config.get('jwtAccountKey') || !config.get('jwtAdminKey') || !config.get('jwtStaffKey')){
    console.error('Error: Please Enter All Necessary Keys');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/BANKA',{useNewUrlParser:true})
    .then(() => console.log('\x1b[35m%s\x1b[0m','MongoDB is connected....'))
    .catch(err => console.error('\x1b[32m%s\x1b[0m', err.details[0].message));

mongoose.set('useFindAndModify',false);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/admins', admin);
app.use('/api/users', user);
app.use('/api/logins', login);
app.use('/api/accounts',account);
app.use('/api/deposits', deposit);



const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('\x1b[35m%s\x1b[0m','You are listening on port '+port+'......');
})