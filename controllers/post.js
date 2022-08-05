const express = require('express')
const asyncHandler = require('../middleware/async')
// Modelos
const Post = require('../models/Post')
const User = require('../models/User')

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  Post.find().sort('-publicationdate').populate('user').exec(function (err, posts) {
    if (err) res.status(500).send(err)
    else res.status(200).json(posts)
  })
})

exports.getPost = asyncHandler(async (req, res, next) => {
  Post.findOne({ _id: req.params.id }, function (err, postinfo) {
    if (err) {
      res.status(404).json({
        error: 'Not found'
      })
    } else res.status(200).json(postinfo)
    next()
  })
})

// no funciona como deberia
exports.getAllPostsUser = asyncHandler(async (req, res, next) => {
  Post.find({ user: req.params.id }).sort('-publicationdate').populate('user').exec(function (err, posts) {
    if (err) res.status(500).json(500)
    else res.status(200).json(posts)
  })
})

exports.createPost = asyncHandler(async (req, res, next) => {
  // aca estoy sacando el iduser decodificado del token gracias al middleware
  const { iduser } = req
  // desustructuracion de req.body
  const {
    title,
    description,
    dateStart,
    dateEnd,
    fullDay,
    timeStart,
    timeEnd,
    address,
    city,
    postalCode,
    ageRange,
    domain,
    email,
    website,
    facebook,
    instagram,
    twitter,
    isActive,
    images,
    createdAt
  } = req.body
  // ya teniendo el id recuperado del token puedo pasarlo como parametro
  User.findById(iduser, function (err, userinfo) {
    if (err) res.status(500).res('hubo un error antes de la instancia, token.id no existe en la db' + 500)
    else {
      // crear la instancia Post
      const postInstance = new Post({
        user: req.iduser,
        title,
        description,
        eventDate: {
          dateStart,
          dateEnd
        },
        eventTime: {
          fullDay,
          timeStart,
          timeEnd
        },
        address,
        city,
        postalCode,
        ageRange,
        domain,
        email,
        website,
        facebook,
        instagram,
        twitter,
        isActive,
        images,
        createdAt
      })
      // añadir postInstance al array de posts del usuario
      userinfo.posts.push(postInstance)
      // salvaar el post en las colecciones users y posts
      userinfo.save(function (err) {
        if (err) res.status(500).send('hubo un error guardar el post' + err)
        else {
          postInstance.save(function (err) {
            if (err) {
              res.status(500).send(err)
            } else {
              res
                .status(200)
                .send({
                  success: true
                })
            }
          })
        }
      })
    }
  })
})

exports.updatePost = asyncHandler(async (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body, function (err, postinfo) {
    if (err) res.status(500).send('se produjo un error al update post' + 500)
    else res.sendStatus(200)
  })
})

exports.deletePost = asyncHandler(async (req, res, next) => {
  Post.findByIdAndDelete(req.params.id, function (err, postinfo) {
    if (err) res.status(500).send(err)
    else {
      User.findByIdAndUpdate(postinfo.user, { $pull: { post: postinfo._id } }, function (err, userinfo) {
        if (err) res.status(500).send(500)
        else res.sendStatus(200)
      })
    }
  })
})
