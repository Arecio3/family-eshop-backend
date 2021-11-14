const expressJwt = require('express-jwt');

// We compare user token to make sure its safe
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        // generating token
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        // List of APIs to exclude from auth
        path: [
            // This allows any param after product to be able to be accessed
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

async function isRevoked(req, payload, done) {
    // Reject Token if is not an Admin
    if (!payload.isAdmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt;