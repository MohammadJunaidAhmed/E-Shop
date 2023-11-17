const { expressjwt: jwt } = require("express-jwt");
require('dotenv/config');


function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
            // `${api}/carts/`, //TODO: Testing purpose, remove this later
        ]
    })
}

async function isRevoked(req, jwt) {

    const payload = jwt.payload
    if (!payload.isAdmin && req.method === 'POST' && req.originalUrl.startsWith(`localhost:3000${process.env.api}/products`)) {
      return true
    }
    return false
  }



module.exports = authJwt