
module.exports = function(req,res,next){
    if(req.user.type !== 'staff'){
        res.status(401).json({ALERT: 'INTRUDER! INTRUDER!'});
    }
    next();
}