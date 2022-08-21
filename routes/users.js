const express = require('express')
const {
  signinUser,
  deleteUser,
  updateUser,
  createUser,
  getUser,
  getAllUsers
} = require('../controllers/user.js')
const { uploadMulter } = require('../middleware/uploadAws.js')
const router = express.Router()
router.use(express.json())

// middleware - aurth jwt
const userExtractor = require('../middleware/userExtractor')

// obtener el listado de users
router.get('/', getAllUsers)

// obtener un user
router.get('/:id', getUser)

// crear un user
router.post('/', createUser)

// actualizar user
router.put('/:id', uploadMulter.array('imageUser', 2), updateUser)

// eliminando a un user
router.delete('/:id', deleteUser)

// coneccion de un user
router.post('/signin', signinUser)
module.exports = router
