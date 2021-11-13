const expressJwt = require('express-jwt');

// We compare user token to make sure its safe
function authJwt() {
    const secret = process.env.secret
    return expressJwt({
        secret,
        // generating token
        algorithms: ['HS256']
    })
}

module.exports = authJwt;