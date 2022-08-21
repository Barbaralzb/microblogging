const multer = require('multer') // multer will be used to handle the form data.
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' }) // aws-sdk library will used to upload image to s3 bucket.
const Aws = require('aws-sdk')
// for using the environment variables that stores the confedential information.

// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback it will get uploaded in main directory

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, '')
  }
})

// below variable is define to check the type of file which is uploaded

const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}
Aws.config.update({
  credentials,
  bucketname: process.env.BUCKET_NAME
})

Aws.config.getCredentials(function (err) {
  if (err) {
    console.log(err.stack)
    console.log('Crédentials not loaded')
  }
  // credentials not loaded
  else {
    console.log('Crédentials loaded successfully')
    //   console.log("Access key:", Aws.config.credentials.accessKeyId);
    //   console.log("Secret access key:", Aws.config.credentials.secretAccessKey);
  }
})

// Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3()

// defining the upload variable for the configuration of photo being uploaded
const uploadMulter = multer({ storage, fileFilter: filefilter })

const __uploadImage = async (files) => {
  // Definning the params variable to uplaod the photo
  // console.log('key id aws env : ', keyId)
  // const params = {
  //   Bucket: process.env.BUCKET_NAME, // bucket that we made earlier
  //   Key: `${Date.now()}-${req.file.originalname}`, // Name of the image
  //   Body: req.file.buffer, // Body which will contain the image in buffer format
  //   ACL: 'public-read-write', // defining the permissions to get the public link
  //   ContentType: 'image/jpeg' // Necessary to define the image content-type to view the photo in the browser with the link
  // }

  // console.log('params : ', params)
  // // uplaoding the photo using s3 instance and saving the link in the database.
  // return new Promise((resolve, reject) => {
  //   s3.upload(params, (error, data) => {
  //     if (error) {
  //       console.log(error)
  //       reject(error)
  //       // res.status(500).send({ err: error }) // if we get any error while uploading error message will be returned.
  //     }
  //     // If not then below code will be executed
  //     console.log(data) // this will give the information about the object in which photo is stored
  //     resolve(data) // return pictures liste created
  //   })
  // })
  try {
    console.log('files : ', files)
    if (!files) return null
    const ResponseData = []
    await Promise.all(
      files.map((item) => {
        const tempKey = `${Date.now()}-${item.originalname.split('.').pop()}`
        tempKey.replace(' ', '_')
        const params = {
          Bucket: process.env.BUCKET_NAME, // bucket that we made earlier
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
      imagesUploaded.map(image => (
        ResponseData.push({ url: image.Location, key: image.Key })
      ))
    }).catch(error => {
      console.log(error)
    })

    return ResponseData
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  __uploadImage,
  uploadMulter,
  s3
}
