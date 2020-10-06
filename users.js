const { Router } = require('express');
const router = Router();
const { INFORMATION } = require('./information')
const { generateToken, verifyToken } = require('./token')
const bcrypt = require('bcrypt');
const saltRounds = 10;


var USERS = [
{
email: 'admin@gmail.com',
name: 'admin',
password:'hashed password',
isAdmin:true
},
]

router.post('/register', async (req, res) => {
const { email, user, password } = req.body;
try {
let occupied = USERS.find(person => person.email === email && person.name === user)
if (!occupied) {
bcrypt.hash(password, saltRounds, function (err, hash) {
USERS.push({email: email, name: user, password: hash, isAdmin:false})
INFORMATION.push({name: user, info: `${user} info`})
generateToken(user, 'access')
generateToken(user, 'refresh')
})
return res.status(201).json({message: 'Register Success'})
} else {
return res.status(409).json({message: 'user already exists'})
}
  } catch (err) {res.json(err)}
})

router.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
let user = USERS.find(person => person.email === email)
if(user) {
bcrypt.compare(password, user.password, function (err, result) {
if (err) return res.json(err)
if (result) {
res.status(200).json({accessToken: generateToken(user, 'access'), refreshToken: generateToken(user, 'refresh'), userName: user.name, isAdmin: user.isAdmin})
}
else return res.status(403).json({message: 'User or Password incorrect'})
})} else {
return res.status(404).json({message: 'cannot find user'})
}
} catch (err) {res.json(err)}
})



router.post('/tokenValidate', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
} else {
console.log(verifyToken(authorization, 'access'))
if (verifyToken(authorization, 'access')){
return res.status(200).json({valid: true})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
}
}} catch (err) { res.json(err)}
})

router.post('/token', async (req, res) => {
const { token } = req.body; // {refresh token}
console.log(verifyToken(token, 'refresh'))
try {
if (!token) {
return res.status(401).json({message: 'Refresh Token Required'})
} else {
if (verifyToken(token, 'refresh')) {
return res.status(200).json({accessToken: token})
} else {
return res.status(403).json({message: 'Invalid Refresh Token'})
}} 
  } catch (err) { res.json(err)}
})

router.post('/logout', async (req, res) => {
const { token } = req.body; // {refresh token}
try {
if (!token) {
return res.status(400).json({message: 'Refresh Token Required'})
} else {
if (verifyToken(token, 'refresh')) {
return res.status(200).json({message: 'User Logged Out Successfully'})
} else {
return res.status(400).json({message: 'Invalid Refresh Token'})
}} 
  } catch (err) { res.json(err)}
})

router.get('/api/vi/users', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
} else {
if (verifyToken(authorization, 'access')) {
return res.status(200).json({USERS: USERS})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
}} 
  } catch (err) { res.json(err)}
})

module.exports = USERS;
module.exports = router;
