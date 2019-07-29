const app = require('../../app');
const {Account} = require('../../model/Account');
const {User} = require('../../model/User')
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');


const user2Id = new mongoose.Types.ObjectId();
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
describe('/api/v1/admin', () =>{
    let admin;
    beforeEach( async () => {
        app; 
        await User.deleteMany();

        admin = new User(user2);
        admin.password = await bcrypt.hash(admin.password, 10);
        await admin.save();

    });

    describe('GET /', () => {
        it('should be able to get all users', async (done) => {
            await request(app)
                .get('/api/v1/admin')
                .set('Authorization', `${user2.token}`)
                .send()
                .expect(200)
            done();
        })

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

        describe('/api/v1/admin/staff', () => {
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

            
        })
    })
})