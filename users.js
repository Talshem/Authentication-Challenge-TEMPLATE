const { Router } = require('express');
const router = Router();
const INFORMATION = require('./information')

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
return res.status(201).json({message: 'Register Success'})
} else {
USERS.push({email: email, name: user, password: password, isAdmin:false})
INFORMATION.push({name: user, info: `${user} info`})
return res.status(409).json({message: 'user already exists'})
}
  } catch (err) { res.json(err)}
})

router.post('/login', async (req, res) => {
 const { email, password } = req.body;
try {
let correct = USERS.find(person => person.email === email && person.password === password)
let incorrect = USERS.find(person => person.email === email && person.password !== password)
if(correct) {
return res.status(200).json( {accessToken: 'x', refreshToken: 'x', userName: correct.name, isAdmin: correct.isAdmin})
} else if (incorrect) {
return res.status(403).json({message: 'User or Password incorrect'})
} else {
return res.status(404).json({message: '"cannot find user'})
}
} catch (err) { res.json(err)}
})



router.post('/tokenValidate', async (req, res) => {
 const { authorization } = req.headers;
try {
if (authorization) {
return res.status(200).json({valid: true})
} else if (!authorization){
return res.status(401).json({message: 'Access Token Required'})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
}
  } catch (err) { res.json(err)}
})

module.exports = USERS;
module.exports = router;
