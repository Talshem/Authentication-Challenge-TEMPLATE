
const express = require('express');
const app = express();
const { verifyToken } = require('./token')

app.use(express.json());


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({ message: 'unknown endpoint' })
  } 

  next(error)
}

app.use(errorHandler)
app.use('/', require('./api'));

app.options('/', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
let array = [ 
{ method: "post", path: "/users/register", description: "Register, Required: email, user, password", example: { body: { email: "user@email.com", name: "user", password: "password" } } },
{ method: "post", path: "/users/login", description: "Login, Required: valid email and password", example: { body: { email: "user@email.com", password: "password" } } },
{ method: "post", path: "/users/token", description: "Renew access token, Required: valid refresh token", example: { headers: { token: "*Refresh Token*" } } },
{ method: "post", path: "/users/tokenValidate", description: "Access Token Validation, Required: valid access token", example: { headers: { authorization: "Bearer *Access Token*" } } },
{ method: "get", path: "/api/v1/information", description: "Access user's information, Required: valid access token", example: { headers: { authorization: "Bearer *Access Token*" } } },
{ method: "post", path: "/users/logout", description: "Logout, Required: access token", example: { body: { token: "*Refresh Token*" } } },
{ method: "get", path: "api/v1/users", description: "Get users DB, Required: Valid access token of admin user", example: { headers: { authorization: "Bearer *Access Token*" } } }
]
try {
res.append('Allow', 'OPTIONS, GET, POST');
if (!authorization) {
return res.status(200).json([array[0], array[1]])
}
else {
if (verifyToken(authorization, 'access') && verifyToken(authorization, 'access').username.isAdmin) {
  return res.status(200).json(array)
} 
if (verifyToken(authorization, 'access')) {
return res.status(200).json([array[0], array[1], array[2], array[4], array[5]])
} else {
return res.status(200).json([array[0], array[1], array[2]])
} 
}
} catch (err) { console.log(err); res.json(err)}
})

module.exports = app