const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    const token = req.header('x-admin-token');
    if(!token) return res.status(401).json({message: 'You are not authorized'});

    try{

        const decoded = jwt.verify(token, config.get('jwtAdmin'));
        req.admin = decoded;
        next();
    }catch(err){
        res.json({message: 'Invalid Token'+err});
    }
}