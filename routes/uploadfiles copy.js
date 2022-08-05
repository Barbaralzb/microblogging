const express = require('express')
const path = require('path')
// multer es un middleware que me ayuda a con la carga de archivos
const multer = require('multer')
// permite trabajar con el sistema de archivos del compu
const fs = require('fs')
const mongoose = require('mongoose')
const router = express.Router()
const db = mongoose.connection

// almacenamiento con Multer
const storage = multer.diskStorage({
  destination (req, file, cb) {
    // cd es una function que da una respuesta
    cb(null, 'uploads')
  },
  filename (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  }
})

function checkFileType (file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

// const upload = multer({ storage })
const upload = multer({ dest: 'uploads/' })

// router.post('/', upload.array('images', 12), (req, res) => {
//   const files = req.file
//   res.send(files)
//   // res.send(`/${req.file.path}`)
// })

// subir imagenes
router.post('/photo', upload.single('picture'), (req, res) => {
  const img = fs.readFileSync(req.file.path)
  const encodeImage = img.toString('base64')
  // Define a JSONobject for the image attributes for saving to database

  const finalImg = {
    contentType: req.file.mimetype,
    image: Buffer.from(encodeImage, 'base64')
  }
  db.collection('quotes').insertOne(finalImg, (err, result) => {
    console.log(result)

    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

router.get('/photos', (req, res) => {
  db.collection('mycollection').find().toArray((err, result) => {
    const imgArray = result.map(element => element._id)
    console.log(imgArray)

    if (err) return console.log(err)
    res.send(imgArray)
  })
})

router.get('/photo/:id', (req, res) => {
  const filename = req.params.id

  db.collection('mycollection').findOne({ _id: ObjectId(filename) }, (err, result) => {
    if (err) return console.log(err)

    res.contentType('image/jpeg')
    res.send(result.image.buffer)
  })
})
// asi funciona upload y es por esto que en la funcin de arriba este permite hacer la funcion para verificar el tipo de file
// const upload = multer({ dest: 'uploads/' })
// end

// https://code.tutsplus.com/es/tutorials/file-upload-with-multer-in-node--cms-32088
// https:// github.com/expressjs/multer/blob/master/doc/README-es.md
// sin destructuracion
router.post('/', upload.array('images', 8), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next('hubo un error', error)
  }
  res.send(file)
})

module.exports = router
