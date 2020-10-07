const { Router } = require('express');
const router = Router();
const { generateToken, verifyToken } = require('./token')
const bcrypt = require('bcrypt');
const saltRounds = 10;

var USERS = []
let INFORMATION = []

bcrypt.hash('Rc123456!', saltRounds, function (err, hash) {
USERS.push({email: 'admin@email.com', name: 'admin', password: hash, isAdmin:true})
INFORMATION.push({name: 'admin', info: 'admin info'})
generateToken('admin', 'access')
generateToken('admin', 'refresh')
})


router.get('/api/v1/information', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
}
else {
if (verifyToken(authorization, 'access')) {
let user = INFORMATION.find(person => person.name === verifyToken(authorization, 'access').username.user)
return res.status(200).json({name: user.name, info: user.info})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
} 
}
} catch (err) { res.json(err)}
})

router.get('/api/v1/users', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
} else {
if (verifyToken(authorization, 'access') && verifyToken(authorization, 'access').username.isAdmin) {
return res.status(200).json(USERS)
} else {
return res.status(403).json({message: 'Invalid Access Token'})
}} 
  } catch (err) { res.json(err)}
})

router.post('/users/register', async (req, res) => {
const { email, name, password } = req.body;
try {
let occupied = USERS.find(person => person.email === email && person.name === user)
if (!occupied) {
bcrypt.hash(password, saltRounds, function (err, hash) {
USERS.push({email: email, name: name, password: hash, isAdmin:false})
INFORMATION.push({name: name, info: `${name} info`})
})
return res.status(201).json({message: 'Register Success'})
} else {
return res.status(409).json({message: 'user already exists'})
}
  } catch (err) {res.json(err)}
})

router.post('/users/login', async (req, res) => {
const { email, password } = req.body;
try {
let user = USERS.find(person => person.email === email)
if(user) {
bcrypt.compare(password, user.password, function (err, result) {
  if (err) return res.json(err)
if (result) {

res.status(200).json({accessToken: generateToken({user: user.name, isAdmin: user.isAdmin}, 'access'), refreshToken: generateToken({user: user.name, isAdmin: user.isAdmin}, 'refresh'), userName: user.name, isAdmin: user.isAdmin})
}
else return res.status(403).json({message: 'User or Password incorrect'})
})} else {
return res.status(404).json({message: 'cannot find user'})
}
} catch (err) { res.json(err) }
})



router.post('/users/tokenValidate', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
} else {
if (verifyToken(authorization, 'access')){
return res.status(200).json({valid: true})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
}
}} catch (err) { res.json(err)}
})

router.post('/users/token', async (req, res) => {
const { token } = req.body; // {refresh token}
try {
if (!token) {
return res.status(401).json({message: 'Refresh Token Required'})
} else {
if (verifyToken(token, 'refresh')) {
return res.status(200).json({accessToken: generateToken(verifyToken(token, 'refresh').username, 'access')})
} else {
return res.status(403).json({message: 'Invalid Refresh Token'})
}} 
  } catch (err) { res.json(err)}
})

router.post('/users/logout', async (req, res) => {
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

module.exports = router
