const jwt = require('jsonwebtoken');

let ACCESS_SECRET = 'access'
let REFRESH_SECRET = 'refresh'

function generateToken(user, option){
   switch (option) {
case 'access':
return jwt.sign(
{username: user},
ACCESS_SECRET,
{ expiresIn: '10s' })
    case 'refresh':
return jwt.sign(
{username: user},
REFRESH_SECRET)
}}

function verifyToken(token, option){
    switch (option) {
        case 'access':
    token = token.slice(7, token.length);
      return jwt.verify(token, ACCESS_SECRET, (error, decoded) => {
        if (error) return false
        return decoded
      })
      case 'refresh':
      return jwt.verify(token, REFRESH_SECRET, (error, decoded) => {
        if (error) return false
        return decoded
        })
}}

module.exports = { generateToken, verifyToken }