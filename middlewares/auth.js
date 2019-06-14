const { User } = require('../model/User');
const passport = require('passport');
const Local = require('passport-local');
const Bearer = require('passport-http-bearer');
const Auth = require('../services/auth');

module.exports = app => {
    passport.use(
        'otp strategy',
        new Local({userNameField: 'username', passwordField: 'username'},
        async (username, password, done) => {
            try{
                // fetch the user 
                const user = await User.findOne({email: username});
                if(!user){
                    return done(null, Boolean(user), {message: 'Incorrect username or password'})
                }

                // check if password is valid
                if(! await user.verifyPassword(password)){
                    return done(null, false, {message: 'Incorrect username or password'})
                }

                // if all is well return user
                return done(null, user);
            }catch(e){done(e)}
        })
    )

    passport.use('authentication', new Bearer(
        async (token, done, tokenData) => {
            try{
                tokenData = await Auth.verifyToken(token);

                let user = await User.findById(tokenData.jwtid);

                if(!user){
                    return done(null, Boolean(user), {message: 'Invalid Token'})
                }

                return done(null, user);
            }catch(e){done(e)}
        }
    ));

    passport.use('Renew Token', new Bearer(
        async (token, done) => {
            try{
                const { jwtId: _id, subject: email} = await Auth.renewToken(token);

                const user = await User.findOne({_id, email});

                if(!user){
                    return done(null, false);
                }

                return done(null, user);
            }catch(e){done(e, null)}
        }
    ));

    passport.serializeUser(function(id, done){
        return done(null, id);
    });

    passport.deserializeUser(function(id, done){
        return done(null, id);
    })

    app.use(passport.initialize());
}
