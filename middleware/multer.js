// multer : maneja las solicitudes HTTP para el envio de archivos

const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

// destino/almacenar las imagenes & el nombre del archivo sea unico
const storage = multer.diskStorage({
  // destinacion del almacenamiento de archivos
  // cd es callback
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    // eliminar los espacios para evitar los _% al nombre
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]

    cb(null, `${name}_${Date.now()}.${extension}`)
  }
})

module.exports = multer({ storage }).single('image')
