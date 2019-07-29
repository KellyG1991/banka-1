const app = require('../../app');
const request = require('supertest');
const {Transaction} = require('../../model/Transaction')
const {Account} = require('../../model/Account')
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
jest.setTimeout(10000);


const accId = new mongoose.Types.ObjectId().toHexString();
const id = new mongoose.Types.ObjectId().toHexString();


describe('/api/v1/transactions', () => {
    let acc;
    let trans;
    beforeEach(async () =>{
        app;
        await Transaction.deleteMany();
        await Account.deleteMany();
        acc = {
            _id: accId,
            ID: 38899293,
            type: "Current",
            status: "Draft",
            accountName: "BOBBY BROWN",
            accountNumber: 393830285020259,
            balance: 0,
            token: jwt.sign({_id:accId}, config.get('jwtKey'), {expiresIn: '365d'}),
        }

        const account = new Account(acc);
        await account.save();


        trans = {
            _id: id,
            type: 'Deposit',
            accountName: "BOBBY BROWN",
            accountNumber: 393830285020259,
            amount: 1000000,
            token: jwt.sign({_id:id}, config.get('jwtKey'), {expiresIn:'365d'})
        }

        const transaction = new Transaction(trans);
        await transaction.save();
    })

    describe('POST /' , () => {
        it('should get a 200 after making a DEPOSIT/WITHDRAWAL request', async (done) => {
            await request(app)
                .post('/api/v1/transactions/account/me')
                .set('Account-Token', `${acc.token}`)
                .send({
                    type: 'Deposit',
                    accountName: "BOBBY BROWN",
                    accountNumber: 393830285020259,
                    amount: 1000000
                }).expect(200)
            done();
        })
    })

    describe('GET /', () => {
        it('should get all transactions', async (done) => {
            await request(app)
                .get('/api/v1/transactions')
                .set('Account-Token', `${acc.token}`)
                .send()
                .expect(200)
            done();
        })
    })

    describe('GET /', () => {
        it('should get certain transactions by date', async (done) => {
            await request(app)
                .get('/api/v1/transactions/date')
                .set('Account-Token', `${acc.token}`)
                .send({
                    start: "2019-01-01",
                    end: "2019-07-29"
                })
                .expect(200)
            done();
        })
    })

    describe('GET /me', () => {
        it('should get certain transactions by id', async (done) => {
           
           const res = await request(app)
                .get('/api/v1/transactions/me')
                .set('Account-Token', `${acc.token}`)
                .set('Transaction', `${trans.token}`)
                .send()

            console.log(res.body);
            expect(res.status).toBe(200);
            done();
        })
    })

})

