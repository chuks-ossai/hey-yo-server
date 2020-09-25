const jsonwebtoken = require('jsonwebtoken');
const appConfig = require('../config/app')

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
const issueToken = async (user) => {

    try {
        const _id = await user._id;
        const expiresIn = '1h';
    
        const payload =  {
            data: user
        };
    
        const signedToken =  jsonwebtoken.sign(payload, appConfig.jwtSecret, { expiresIn: expiresIn });
    
        return {
            token: "Bearer " + signedToken,
            expires: expiresIn
        }
    } catch (err) {
        return {
            error: err
        }

    }
}

module.exports = issueToken;