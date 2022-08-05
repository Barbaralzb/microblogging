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
const Aws = require('aws-sdk')

const bucketName = process.env.BUCKET_NAME
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const accessKey = process.env.AWS_ACCESS_KEY_ID
const bucketRegion = process.env.BUCKET_REGION

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKey,
//     secretAccessKey
//   },
//   region: bucketRegion
// })

const storage = multer.memoryStorage()
const s3 = new Aws.S3()
const credentials = {
  accessKeyId: accessKey,
  secretAccessKey
}
Aws.config.update({
  credentials,
  bucketname: bucketName
})

const uploadMulter = multer({ storage })

router.post('/', uploadMulter.array('images', 6), async (req, res) => {
  const files = req.files
  const ResponseData = []
  await Promise.all(
    files.map((item) => {
      const tempKey = `${Date.now()}-${item.originalname.split('.').pop()}`
      tempKey.replace(' ', '_')
      const params = {
        Bucket: bucketName, // bucket that we made earlier
        Key: `${Date.now()}-${item.originalname.split('.').pop()}`, // Name of the image
        Body: item.buffer, // Body which will contain the image in buffer format
        // ACL: 'public-read-write', // defining the permissions to get the public link
        ContentType: 'image/jpeg' // Necessary to define the image content-type to view the photo in the browser with the link
      }

      // uplaoding the photo using s3 instance and saving the link in the database.
      // return s3.upload(params).promise() // wait for the end of this opération

      return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
          if (err) {
            reject(err)
          } else {
            console.log('Successfully uploaded data to bucket: ', data.Location)
            resolve(data)
          }
        })
      })
    })
  ).then(async imagesUploaded => {
    console.log('data : ', imagesUploaded)
    imagesUploaded.map(imagePost => (
      ResponseData.push({ url: imagePost.Location, key: imagePost.Key })
    ))
  })
    .catch(error => {
      console.log(error.message)
    })
  return ResponseData
}
)

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
