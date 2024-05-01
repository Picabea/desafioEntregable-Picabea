// const jwt = require('jsonwebtoken')

// const PRIVATE_KEY = "auwhdas1231dn89"

// const generateToken = (credentials) => {
//     const token = jwt.sign(credentials, PRIVATE_KEY, {expiresIn: "24h"})
//     return token
// }

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization
//     if(!authHeader){
//         return res.status(401).json({ error: "Token not found" })
//     }

//     const [, token] = authHeader.split(' ')
//     jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
//         if(err){
//             return res.status(401).json({error: 'Invalid Token'})
//         }

//         req.authUser = credentials
//         next()
//     })
// }

// module.exports = {
//     generateToken,
//     verifyToken
// }