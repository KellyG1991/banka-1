const app = require('../../app');
const request = require('supertest');
const {
    User
} = require('../../model/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
jest.setTimeout(10000);


const user1Id = new mongoose.Types.ObjectId();

describe('/api/v1/users', () => {
    let user1;
    beforeEach(async () => {
        app;
        await User.deleteMany();
        user1 = {
            _id: user1Id,
            type: "Client",
            firstName: "Kim",
            lastName: "Kadarshian",
            email: "kim@gmail.com",
            password: "bigbutts",
            DOB: "1987-04-29",
            token: jwt.sign({
                _id: user1Id
            }, config.get('jwtKey'), {
                expiresIn: "365d"
            })
        }

        const user = new User(user1);
        user.password = await bcrypt.hash(user.password, 10);

        await user.save();

    });

    afterAll(async () => {
        await mongoose.disconnect();
    })

    describe('POST /', () => {
        it('should get back a 200 message of successful signup', async (done) => {
            await request(app).post('/api/v1/users/signup').send({
                type: "Client",
                firstName: "drew",
                lastName: "sharp",
                email: "drew@gmail.com",
                password: "drewsharp",
                DOB: "1987-04-29"
            }).expect(200)
            done();
        }, 1000)

        it('should get back 422 if user already exists', async (done) => {
            const res = await request(app).post('/api/v1/users/signup').send({
                type: "Client",
                firstName: "drew",
                lastName: "sharp",
                email: "kim@gmail.com",
                password: "drewsharp",
                DOB: "1987-04-29"
            })
            expect(res.status).toBe(422);
            expect(res.body).toMatchObject({
                message: 'User already exists'
            })
            done();
        }, 1000)

        it('should get back 422 if missing field', async (done) => {
            await request(app).post('/api/v1/users/signup').send({
                type: "Client",
                firstName: "drew",
                lastName: "sharp",
                email: "drew@gmail.com",
                DOB: "1987-04-29"
            }).expect(422)
            done();
        }, 1000)

        it('should get back 200 if logged in successfully', async (done) => {
            const res = await request(app).post('/api/v1/users/login').send({
                email: user1.email,
                password: user1.password
            })
            // console.log(user1.password);
            expect(res.status).toBe(200);

            done();
        }, 1000)

        it('should not login non-existant user by sending a 400', async (done) => {
            await request(app).post('/api/v1/users/login').send({
                email: "kelwti@gmail.com",
                password: "kdii234235"
            }).expect(400);
            done();
        }, 1000)

        it('should not create an account if there is a missing field by sending a 422', async (done) => {
            const res = await request(app)
                .post('/api/v1/users/account')
                .set('Authorization', `${user1.token}`)
                .send()

            expect(res.status).toBe(422);

            done();
        })

        it('should be able to create an account', async (done) => {
            const res = await request(app)
                .post('/api/v1/users/account')
                .set('Authorization', `${user1.token}`)
                .send({
                    ID: 2186378393
                })

            expect(res.status).toBe(200);

            done();
        })
    })
})