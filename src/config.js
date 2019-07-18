const config = require('config');

module.exports = () => {
    if(!process.env.MONGODB_URI){
        throw new Error('DATABASE NOT DEFINED');
    }
    else if(!config.get('jwtKey')){
        throw new Error('jwtKey not defined');
    }
}