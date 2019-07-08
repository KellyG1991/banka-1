const mongoose = require('mongoose');

const db = mongoose.connect('mongodb+srv://kgasasira:1991sexybrown@mongodb-kelly-atztv.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser:true})
            .then(() => console.log('\x1b[34m%s\x1b[0m','MongoDB is connected........'))
            .catch((err) => console.log('\x1b[31m%s\x1b[0m', err));


module.exports = db;