const express = require('express')
const asyncHandler = require('../middleware/async')
const router = express.Router()

exports.uploadImages = asyncHandler(async (req, res, next) => {
  res.send(`${req.file.path}`)
})

module.exports = router
