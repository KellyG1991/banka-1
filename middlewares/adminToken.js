const jwt = require('jsonwebtoken');
const config = require('config');

function verify(req,res,next){
    if(!req.admin.isAdmin){
        res.status(403).send('Access Denied');
    }
    next();
}

function adminToken(req,res,next){
    const token = req.header('x-admin-token');
    if(!token){
        res.status(401).send('Not allowed!')
    }
    try{
        const decoder = jwt.verify(token,config.get('jwtAdminKey'));
        req.admin = decoder;
        next();
    }catch(ex){
        res.status(400).send('Invalid Token')
    }    
}

exports.verify = verify;
exports.adminToken = adminToken;