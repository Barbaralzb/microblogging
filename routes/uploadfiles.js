const express = require('express')
// const { uploadImages } = require('../controllers/uploadfile')
const router = express.Router()

// importacion middleware multer para la gestion de imagenes

const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

// Gestion del almacenamiento
const storage = multer.diskStorage({
  // destinacion del almacenamiento de archivos
  // cd es callback
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  // hacemos que el nombre sea unico
  filename: (req, file, cb) => {
    // eliminar los espacios para evitar los _% al nombre
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]

    cb(null, `${name}_${Date.now()}.${extension}`)
  }
})
// Subir la(s) imagenes, su destino
const upload = multer({ storage })

// Servicio para subir las imagenes
router.post('/', upload.array('images', 6), (req, res) => {
  console.log('req:', req)
  console.log('mes images:', req.files)
  const data = []
  // no entiendo porque tiene que ser req.files
  for (let i = 0; i < req.files.length; i++) {
    data.push(`/${req.files[i].path}`)
  }
  console.log('data : ', data)
  res.send(data)
})

module.exports = router
