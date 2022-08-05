const express = require('express')
const router = express.Router()
const multer = require('multer')
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const dotenv = require('dotenv')
const sharp = require('sharp')
const Post = require('../models/Post')
const { default: mongoose } = require('mongoose')
dotenv.config()

const bucketName = process.env.BUCKET_NAME
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const accessKey = process.env.ACCESS_KEY
const bucketRegion = process.env.BUCKET_REGION

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey
  },
  region: bucketRegion
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.array('images', 6), async (req, res) => {
  const imagesUrls = []
  for (const file of req.files) {
    // const buffer = await sharp(file.buffer).resize({ width: 1080, height: 1350, fit: 'contain' }).toBuffer()
    const imageName = `${Date.now()}-${file.originalname}`
    const params = {
      Bucket: bucketName, // bucket that we made earlier
      Key: imageName, // Name of the image
      Body: file.buffer, // Body which will contain the image in buffer format
      ContentType: 'image/jpeg' // Necessary to define the image content-type to view the photo in the browser with the link
    }
    const command = new PutObjectCommand(params)
    const res = await s3.send(command)

    imagesUrls.push(res)
  }
  Promise.all(imagesUrls).then(() => {
    res.send(imagesUrls)
    console.log(imagesUrls)
  }
  )
})

// id evenement
router.delete('/:id', async (req, res) => {
  // const id = mongoose.Types.ObjectId(req.params.id.trim())
  const id = req.params.id
  const post = await Post.findById({
    'images._id': id
  })
  if (!post) {
    res.status(404).send('Post not found')
  }

  // const params = {
  //   Bucket: bucketName,
  //   Key: post.name
  // }

  // const command = new DeleteObjectCommand(params)
  // await s3.send(command)

  console.log(post)

  // await Post.findOneAndUpdate({
  //   id
  // }, {
  //   $pull: {
  //     images:
  //    }
  // })
})

module.exports = router
