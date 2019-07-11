
module.exports = function(req,res,next){
    if(!req.user.isAdmin){
        res.status(403).json({Alert: 'YOU ARE TOTALLY NOT AUTHORIZED TO BE HERE!!'})
    }
    next();
}