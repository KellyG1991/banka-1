const config = require('config');

module.exports = () => {
    if(!config.get("db")){
        throw new Error('DATABASE NOT DEFINED');
    }
    else if(!config.get('jwtKey')){
        throw new Error('jwtKey not defined');
    }
}