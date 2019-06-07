const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = async function(req,res,next){
    let token = req.header('x-account-token');
    if(!token){
        res.status(401).send('NOT AUTHORIZED. Unrecognised Account')
    }
    try{
        const decoder = await jwt.verify(token,config.get('jwtAccountKey'));
        req.account = decoder;
        next();
    }catch(ex){
        res.status(403).send('Invalid Token')
    }
}