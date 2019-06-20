const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    const token = req.header('x-login-token');
    if(!token) return res.status(401).json({message: 'You are notyy authorized'});

    try{

        const decoded = jwt.verify(token, config.get('jwtClient'));
        req.staff = decoded;
        next();
    }catch(err){
        res.json({message: 'Invalid Token'});
    }
}