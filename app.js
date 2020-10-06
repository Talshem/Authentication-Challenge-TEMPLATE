
const express = require('express');
const app = express();

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
console.log(req)
const { authorization } = req.headers; //Bearer {access token}
try {
return res.status(200).json({x: req.headers, header: {Allow: "OPTIONS, GET, POST"}, body:'apis array'})
  } catch (err) { res.json(err)}
})

module.exports = app