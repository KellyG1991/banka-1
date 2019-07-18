const express = require('express');
const error = require('../middlewares/error');
const client = require('../routes/users/clientRt');
const transaction = require('../routes/transactionRt');
const staff = require('../routes/users/staffRt');
const morgan = require('morgan');
module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(morgan('tiny'));
    app.use('/api/v1/users', client);
    app.use('/api/v1/transactions',transaction);
    app.use('/api/v1/admin', staff);
    app.use(error);
}
