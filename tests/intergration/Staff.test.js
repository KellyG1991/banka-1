const app = require('../../app');
const {Account} = require('../../model/Account');
const {Transaction} = require('../../model/Transaction')
const {User} = require('../../model/User')
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
jest.setTimeout(10000);


// user 
const user2Id = new mongoose.Types.ObjectId().toHexString();
const user2 = {
    _id: user2Id,
    type: "Staff",
    firstName: "Kim",
    lastName: "Kadarshian",
    email: "kim@gmail.com",
    password: "bigbutts",
    DOB: "1987-04-29",
    token: jwt.sign({_id:user2Id}, config.get('jwtKey'),{expiresIn: "365d"}),
    isAdmin: true
}

//account
const accId = new mongoose.Types.ObjectId().toHexString();


// deposit
const id = new mongoose.Types.ObjectId().toHexString();
const trans = {
    _id: id,
    type: 'Deposit',
    accountName: "JAMES GORDON",
    accountNumber: 839392087473829,
    amount: 1000000,
    token: jwt.sign({_id:id}, config.get('jwtKey'), {expiresIn:'365d'})
}

// withdraw
const wid = new mongoose.Types.ObjectId().toHexString();
const trans2 = {
    _id: wid,
    type: 'Withdrawal',
    accountName: "JAMES GORDON",
    accountNumber: 839392087473829,
    amount: 1000000,
    token: jwt.sign({_id:wid}, config.get('jwtKey'), {expiresIn:'365d'})
}


describe('/api/v1/admin', () =>{
    let acc;
    beforeEach( async () => {
        app; 
        await User.deleteMany();
        await Transaction.deleteMany();
        await Account.deleteMany();


        acc = {
            _id: accId,
            ID: 89274399,
            type: "Current",
            status: "Draft",
            accountName: "JAMES GORDON",
            accountNumber: 839392087473829,
            balance: 0,
            token: jwt.sign({_id:accId}, config.get('jwtKey'), {expiresIn: '365d'}),
        }



        let admin = new User(user2);
        admin.password = await bcrypt.hash(admin.password, 10);
        await admin.save();

        let account = new Account(acc);
        await account.save();

        let transaction = new Transaction(trans);
        await transaction.save();

        let withdraw = new Transaction(trans2);
        await withdraw.save();


    });

    describe('GET /', () => {
        it('should be able to get all users', async (done) => {
            const res = await request(app)
                .get('/api/v1/admin')
                .set('Authorization', `${user2.token}`)
                .send()
            
            expect(res.status).toBe(200);
            done();
        },10000)

    })
    describe('GET /:_id', () => {
        it('should be able to get a specific user', async (done) =>{
            await request(app)
                .get('/api/v1/admin/'+user2._id)
                .set('Authorization', `${user2.token}`)
                .send()
                .expect(200)
            done();
        })
    })

    describe('POST /', () => {
        it("should send a 200 message when an admin is created", async (done) =>{
            const id = new mongoose.Types.ObjectId().toHexString()
            await request(app)
                .post('/api/v1/admin')
                .send({
                    _id: id,
                    type: "Staff",
                    firstName: "Susan",
                    lastName: "Stacy",
                    email: "stacy@gmail.com",
                    password: "stacy123",
                    DOB: "1988-04-29",
                    token: jwt.sign({_id:id}, config.get('jwtKey'),{expiresIn: "365d"}),
                    isAdmin: true 
                })
                .expect(200)
            done();
        })

        it('should send a 200 for successful token renewal', async (done) => {
            await request(app)
                .post('/api/v1/admin/renewToken')
                .set('Authorization',`${user2.token}`)
                .send({
                    email: user2.email,
                    password: user2.password              
                }).expect(200)
    
            done();
        })

        // ALL STAFF/CASHIER ROUTERS
        const staffid = new mongoose.Types.ObjectId().toHexString();
        

        describe('/api/v1/admin/staff', () => {
            let staff;
            beforeEach(async () => {
                staff = {
                    _id: staffid,
                    type: "Staff",
                    firstName: "Greg",
                    lastName: "Martin",
                    email: "James@gmail.com",
                    password: "jake1234",
                    DOB: "1991-09-30",
                    token: jwt.sign({_id:staffid}, config.get('jwtKey'),{expiresIn: "365d"}) 
                }

                const stf = new User(staff);
                stf.password = await bcrypt.hash(stf.password, 10);
                await stf.save();
            })
            describe('POST /', () => {
                it('should send a 200 message when an staff is created', async(done) => {
                    const stfid = new mongoose.Types.ObjectId().toHexString();
                    await request(app)
                        .post('/api/v1/admin/staff')
                        .set('Authorization',`${user2.token}` )
                        .send({
                            _id: stfid,
                            type: "Staff",
                            firstName: "Mike",
                            lastName: "Jake",
                            email: "Mike@gmail.com",
                            password: "mike1234",
                            DOB: "1988-08-30",
                            token: jwt.sign({_id:stfid}, config.get('jwtKey'),{expiresIn: "365d"})
                        }).expect(200)
        
                        done();
                })
                it('should send a 200 message to renew a token', async (done) => {
                    await request(app)
                        .post('/api/v1/admin/staff/renewToken')
                        .set('Authorization', `${staff.token}`)
                        .send({
                            email: "James@gmail.com",
                            password: "jake1234" 
                        })
                        .expect(200)
                    done();
                })
    
                it('staff should CREDIT an account and get back a 200', async(done) => {
                    const res = await request(app)
                        .post('/api/v1/admin/staff/accounts/credit')
                        .set('Authorization', `${staff.token}`)
                        .set('Account-Token', `${acc.token}`)
                        .set('Transaction',`${trans.token}` )
                        .send()
                    
                    expect(res.status).toBe(200);
        
                    done();
                })
    
                it('staff should DEBIT an account and get back a 200', async(done) => {
                    const res = await request(app)
                        .post('/api/v1/admin/staff/accounts/debit')
                        .set('Authorization', `${staff.token}`)
                        .set('Account-Token', `${acc.token}`)
                        .set('Transaction', `${trans2.token}`)
                        .send()
                    
                    expect(res.status).toBe(200);
                    done();
                })
            })

            describe('GET /' , () => {
                it('staff and admin should get all accounts', async (done) => {
                    await request(app)
                        .get('/api/v1/admin/staff/accounts')
                        .set('Authorization', `${user2.token}`)
                        .send()
                        .expect(200)
                    done();
                })
            })

            describe('GET /me' , () => {
                it('staff and admin should get a specific account', async (done) => {
                    await request(app)
                        .get('/api/v1/admin/staff/accounts/me')
                        .set('Authorization', `${user2.token}`)
                        .set('Account-Token', `${acc.token}`)
                        .send()
                        .expect(200)
                    done();
                })
            })

            describe('DELETE /' , () => {
                it('staff and admin should DELETE a specific account', async (done) => {
                    const res = await request(app)
                        .delete('/api/v1/admin/staff/accounts')
                        .set('Authorization', `${user2.token}`)
                        .set('Account-Token', `${acc.token}`)
                        .send()
                    

                    expect(res.status).toBe(200);
                    done();
                })
            })
        })
    })
})