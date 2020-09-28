const jsonwebtoken = require('jsonwebtoken');
const appConfig = require('../config/app')

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
const issueToken = async (user) => {

    try {
        const _id = await user._id;
        const expiresIn = '1d';
        const n = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
    
        const payload =  {
            sub: user
        };
    
        const signedToken =  jsonwebtoken.sign(payload, appConfig.jwtSecret, { expiresIn });
    
        return {
            token: "Bearer " + signedToken,
            expires: n.getTime()
        }
    } catch (err) {
        return {
            error: err
        }

    }
}

module.exports = issueToken;