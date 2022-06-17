const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.js')
const db = mongoose.connection
const router = express.Router()
router.use(express.json())

// obtener el listado de users
router.get('/', function (req, res, next) {
  User.find().sort('-creationdate').exec(function (err, users) {
    if (err) res.status(500).send('Hubo un error' + err)
    else res.status(200).json(users)
  })
})

// obtener un user
router.get('/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err)
    else res.status(200).json(userinfo)
  })
})

// crear un user
router.post('/', function (req, res, next) {
  User.create(req.body, function (err, userinfo) {
    if (err) {
      res.status(500).send(err)
      console.log('hubo un error al crear new user')
    } else res.sendStatus(200)
  })
})

// actualizar user
router.put('/:id', function (req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, userinfo) {
    if (err) res.status(500).send(err)
    else res.sendStatus(200)
  })
})

// eliminando a un user
router.delete('/:id', function (req, res, next) {
  User.findByIdAndDelete(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err)
    else res.sendStatus(200)
  })
})

// coneccion de un user
router.post('/signing', function (req, res, next) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) res.send(500).send('el usuario no existe')
    // si existe
    if (user != null) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return next(err)
        // si el password es correcto
        if (isMatch) { res.status(200).send({ message: 'ok', role: user.role, id: user._id }) } else { res.status(200).send({ message: 'ko' }) }
      })
    } else res.status(401).send({ message: 'ko' })
  })
})
module.exports = router
