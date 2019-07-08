const mongodb = require('mongodb');
const database = require('../database');

const db = mongodb.MongoClient.connect(database, {useNewUrlParser:true})
            .then(() => console.log('\x1b[34m%s\x1b[0m','MongoDB is connected........'))
            .catch((err) => console.log('\x1b[31m%s\x1b[0m', err));


module.exports = db;