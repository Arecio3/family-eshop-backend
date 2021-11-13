const expressJwt = require('express-jwt');

// We compare user token to make sure its safe
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        // generating token
        algorithms: ['HS256']
    }).unless({
        // List of APIs to exclude from auth
        path: [
            // This allows any param after product to be able to be accessed
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/v1/users/login`,
            `${api}/v1/users/register`
        ]
    })
}

module.exports = authJwt;