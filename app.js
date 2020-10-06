
const express = require('express');
const app = express();
const { infoRouter } = require('./information')

app.use(express.json());
// app.use(express.static(__dirname + '/client/build'));


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({ message: 'unknown endpoint' })
  } 

  next(error)
}

app.use(errorHandler)
app.use('/users/', require('./users'));
app.use('/api/vi/', infoRouter);

app.options('/', async (req, res) => {
const { authorization } = req.headers; //Bearer {access token}
console.log(req.headers)
try {
return res.status(200).json({x: req.headers, header: {Allow: "OPTIONS, GET, POST"}, body:'apis array'})
  } catch (err) { res.json(err)}
})

module.exports = app