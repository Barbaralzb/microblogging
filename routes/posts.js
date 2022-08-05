const express = require('express')
const {
  getAllPosts,
  getPost,
  getAllPostsUser,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post')
const router = express.Router()

// middleware - aurth jwt
const userExtractor = require('../middleware/userExtractor')

router.get('/', getAllPosts)
router.get('/:id', getPost)
router.get('/all/:id', getAllPostsUser)
router.post('/', userExtractor, createPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

// controlar error 404
router.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Error captado por use() Not found'
  })
})

module.exports = router
