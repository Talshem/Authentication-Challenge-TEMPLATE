const { Router } = require('express');
const router = Router();
const USERS = require('./users')

var INFORMATION = [
{
name: 'admin',
info:'hashed password',
},
]

router.get('/', async (req, res) => {
const { authorization } = req.headers;
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
}
else {
let user = USERS.find(person => person.token === authorization)
if (user) {
return res.status(200).json({name: userInfo.name, info: userInfo.info})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
} 
}
} catch (err) { res.json(err)}
})



module.exports = INFORMATION;
module.exports = router;