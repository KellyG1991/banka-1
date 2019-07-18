const mongoose = require('mongoose');
const winston = require('winston');

const db = mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser:true})
            .then(() => winston.info('\x1b[34m%s\x1b[0m','MongoDB is connected........'))

module.exports = db;