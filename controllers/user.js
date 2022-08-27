const express = require('express')
const asyncHandler = require('../middleware/async')
const jwt = require('jsonwebtoken')

// Modelos
const User = require('../models/User')
const { __uploadImage } = require('../middleware/uploadAws')

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  User.find().sort('-creationdate').exec(function (err, users) {
    if (err) res.status(500).send('Hubo un error' + err)
    else res.status(200).json(users)
  })
})

exports.getUser = asyncHandler(async (req, res, next) => {
  User.findById(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err)
    else res.status(200).json(userinfo)
  })
})

exports.createUser = asyncHandler(async (req, res, next) => {
  User.create(req.body, function (err, userinfo) {
    if (err) {
      res.status(500).send(err)
      console.log('hubo un error al crear new user', err)
    } else {
      res
        .status(200)
        .send({
          success: true
        })
    }
  })
})

exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    const {
      username,
      description,
      domain,
      facebook,
      instagram,
      twitter,
      website,
      address,
      city,
      postalCode
    } = req.body
    console.log('req : ', req)
    const image = req.files
    console.log('body : ', req.body)
    console.log('req files : ', req.files)
    const imageResponse = await __uploadImage(image)
    console.log('images uploaded to s3 : ', imageResponse)
    await User.findByIdAndUpdate(req.params.id, {
      username,
      description,
      domain,
      facebook,
      instagram,
      twitter,
      website,
      address,
      city,
      postalCode,
      image: imageResponse ? imageResponse[0] : null
    }, { new: true }).then(userUpdated => {
      res
        .status(200)
        .send({
          success: true,
          data: userUpdated
        })
    }).catch(error => {
      console.log(error)
      return res.status(505).send('hubo un error guardar el user' + error.message)
    })
  } catch (error) {
    console.log(error)
    return res.status(404).send(error.message)
  }
})

exports.deleteUser = asyncHandler(async (req, res, next) => {
  User.findByIdAndDelete(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err)
    else res.sendStatus(200)
  })
})

exports.signinUser = asyncHandler(async (req, res, next) => {
  console.log(req)
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) res.status(500).send('Error comprobando el usuario')
    // si existe
    if (user != null) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return next(err)
        // si el password es correcto
        if (isMatch) {
          const userForToken = {
            id: user._id,
            username: user.username
          }
          const token = jwt.sign(userForToken, process.env.JWT_SECRET)

          res.send({
            success: true,
            id: user.id,
            token
          })
            .status(200)
        } else { res.status(200).send({ message: 'ko' }) }
      })
    } else res.status(401).send({ message: 'ko' })
  })
})
