
module.exports = function(req,res,next){
    if(req.admin.type !== 'Admin'){
        res.status(401).json({ALERT: 'INTRUDER! INTRUDER!'});
    }
    next();
}