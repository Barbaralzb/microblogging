const express = require('express')
const {
  getAllPosts,
  getPost,
  getAllPostsUser,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post')
const { uploadMulter } = require('../middleware/uploadAws')
const router = express.Router()

// middleware - aurth jwt
const userExtractor = require('../middleware/userExtractor')

router.get('/', getAllPosts)
router.get('/:id', getPost)
router.get('/all/:id', getAllPostsUser)
router.post('/', userExtractor, uploadMulter.array('imageEvent', 4), createPost)
router.put('/:id', updatePost)
router.delete('/:id', userExtractor, deletePost)

// controlar error 404
router.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Error captado por use() Not found'
  })
})

module.exports = router
