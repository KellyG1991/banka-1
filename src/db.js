const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/banka', {useNewUrlParser:true})
            .then(() => console.log('\x1b[34m%s\x1b[0m','MongoDB is connected........'))
            .catch((err) => console.log('\x1b[31m%s\x1b[0m', err));


module.exports = db;