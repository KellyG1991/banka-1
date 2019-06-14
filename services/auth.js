const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');


class Auth {
    constructor() {
        this.key = config.get('jwtKey');
        this.option = config.get('jwtOptions');
        this.issuer = config.get('app_url');
    }

    // generate authentication token
    async generateToken(claims = {}) {

        const options = _.pick(this.option, ['expiresIn', 'audience']);

        options = Object.assign({issuer: this.issuer}, options);

        return jwt.sign(claims, this.key, options);
    }

    // verify token

    async verifyToken(token) {
        const options = _.pick(this.option,['audience'] );

        options = Object.assign({issuer: this.issuer}, options);

        return jwt.verify(token, this.key, options);
    } 

    // Renew token

    async renewToken(token){
        const options = _.pick(this.option, ['maxAge', 'audience']);

        options = Object.assign({
            issuer: this.issuer,
            ignoreExpiration: true
        }, options)

        return jwt.verify(token, this.key, options);
    }
}

module.exports = new Auth();