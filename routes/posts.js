const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Modelos
const Post = require('../models/Post')
const User = require('../models/User')

// middleware
const userExtractor = require('../middleware/userExtractor')

// GET del listado de posts ordenados por fecha de publicacion
router.get('/', function (req, res, next) {
  Post.find().sort('-publicationdate').populate('user').exec(function (err, posts) {
    if (err) res.status(500).send(err)
    else res.status(200).json(posts)
  })
})

router.get('/:id', function (req, res, next) {
  Post.find({ _id: req.params.id }, function (err, postinfo) {
    if (err) {
      res.status(404).json({
        error: 'Not found'
      })
    } else res.status(200).json(postinfo)
    next()
  })
})

router.get('/all/:id', function (req, res, next) {
  Post.find({ user: req.params.id }).sort('-publicationdate').populate('user').exec(function (err, posts) {
    if (err) res.status(500).json(500)
    else res.status(200).json(posts)
  })
})

// crear un post
router.post('/', userExtractor, function (req, res, next) {
  // aca estoy sacando el iduser decodificado del token gracias al middleware
  const { iduser } = req
  // ya teniendo el id recuperado del token puedo pasarlo como parametro
  User.findById(iduser, function (err, userinfo) {
    if (err) res.status(500).res('hubo un error antes de la instancia' + 500)
    else {
      // crear la instancia Post
      const postInstance = new Post({
        user: req.body.iduser,
        title: req.body.title,
        description: req.body.description
      })
      // añadir postInstance al array de posts del usuario
      userinfo.posts.push(postInstance)
      // salvaar el post en las colecciones users y posts
      userinfo.save(function (err) {
        if (err) res.status(500).send('hubo un error guardar el post' + err)
        else {
          postInstance.save(function (err) {
            if (err) res.status(500).send(err)
            res.sendStatus(200)
          })
        }
      })
    }
  })
})

// Actualizar un post
// Put de un post existente (identificado por su Id)
router.put('/:id', function (req, res, next) {
  Post.findByIdAndUpdate(req.params.id, req.body, function (err, postinfo) {
    if (err) res.status(500).send('se produjo un error al update post' + 500)
    else res.sendStatus(200)
  })
})

// Borrando un post
router.delete('/:id', function (req, res, next) {
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

// controlar error 404
router.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Error captado por use() Not found'
  })
})

module.exports = router
