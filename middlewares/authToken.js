const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = async function(req,res,next){
    const token = req.header('x-auth-token');
    if(!token){
        res.status(401).send('Not Authorized. Authorization token not provided');
    }
    try{
        const decoded = await jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(403).send('Invalid Token provided');
    }
}