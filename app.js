
const express = require('express');
const app = express();

app.use(express.json());
// app.use(express.static(__dirname + '/client/build'));


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ message: 'unknown endpoint' })
  } 

  next(error)
}

app.use(errorHandler)
app.use('/users/', require('./users'));
app.use('/api/vi/', require('./information'));


module.exports = app