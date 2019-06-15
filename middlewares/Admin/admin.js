
module.exports = function(req,res,next){
    if(!req.admin.type){
        res.status(401).json({ALERT: 'INTRUDER! INTRUDER!'});
    }
    next();
}