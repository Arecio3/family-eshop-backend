const expressJwt = require('express-jwt');

// We compare user token to make sure its safe
function authJwt() {
    const secret = process.env.secret
    return expressJwt({
        secret,
        // generating token
        algorithms: ['HS256']
    }).unless({
        path: [
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
}

module.exports = authJwt;