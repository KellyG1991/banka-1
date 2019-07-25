let server;
const request = require('supertest');
const {User} = require('../../model/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const time = require('../../helpers/time');
const sinon = require('sinon');
sinon.stub(time,'setTimeout');

describe('api/v1/users', () => {
    beforeEach(() => {server = require('../../index');});
    afterEach(async () => {
        server.close();
        await User.deleteMany({});
    })

    describe('POST /signup', () => {
        it('should return a 422 if there are missing fields', async (done) => {
            let user = new User({
                firstName: "Gasasira Kelly"
            })
            let res = await request(server)
                .post('/api/v1/users/signup')
                .send(user);

            expect(res.status).toBe(422);
            
            done();
        })

        it('should return a 200 if user signsup successfully ', async(done) => {
            
            let res = await request(server)
                .post('/api/v1/users/signup')
                .send({
                    type: "Client",
                    firstName: "Kelly",
                    lastName: "Musonera",
                    email: "kgasasira@gmail.com",
                    password: "kelly1234",
                    DOB: "1991-09-19"
                });
            
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: 'User created successfully'
            });

            done();
        })
    })

    describe('POST /login', () => {
        it('should throw an error if email or password is not valid', async (done) => {
        
           await User.collection.insertOne({
                type: "Client",
                firstName: "Kelly",
                lastName: "Musonera",
                email: "kgasasira@gmail.com",
                password: "kelly1234",
                DOB: "1991-09-19"
           })

           const res = await request(server)
                .post('/api/v1/users/login')
                .send({
                    email: "mich@gmail.com",
                    password: "mike123"
                })
            
            expect(res.status).toBe(400);    
            done();
        })
        
    })
})


describe('api/v1/admin', () => {
    beforeEach(() => {server = require('../../index')});
    afterAll(async () => {
        server.close();
        await User.deleteMany();
    })

    describe('GET /' , () => {
        it('should return a 401 if not admin', async (done) => {
            const res = await request(server).get('/api/v1/admin');

            expect(res.status).toBe(401)
            done();
        })

        
    })
})