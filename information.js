const { Router } = require('express');
const router = Router();

let INFORMATION = [
{
name: 'admin',
info:'hashed password',
},
]

router.get('/', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
try {
if (!authorization) {
return res.status(401).json({message: 'Access Token Required'})
}
else {
if (verifyToken(authorization, 'access')) {
return res.status(200).json({name: userInfo.name, info: userInfo.info})
} else {
return res.status(403).json({message: 'Invalid Access Token'})
} 
}
} catch (err) { res.json(err)}
})



module.exports = {
infoRouter: router,
INFORMATION: INFORMATION
}