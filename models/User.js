const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10
const UserSchema = new Schema({
  username: {
    type: String, required: [true, 'Nom de l`association required to create profile'], index: { unique: true }
  },
  password: {
    type: String,
    required: [true, 'Ingrese una constraseña valida']
    // select: false
  },
  email: {
    type: String, required: [true, 'Ingrese email']
  },
  creationdate: {
    type: Date, default: Date.now
  },
  description: String,
  domain: {
    color: String,
    label: String,
    id: Number
  },
  facebook: String,
  instagram: String,
  twitter: String,
  website: String,
  images: {
    url: String,
    key: String
  },
  posts: [
    { type: Schema.ObjectId, ref: 'Post', default: null }
  ],
  address: String,
  city: String,
  postalCode: {
    type: Number,
    min: 10000,
    max: 99999
    // required: [true, 'Code postal required']
  }
})

UserSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next()
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next()
      user.password = hash
      next()
    })
  })
})
UserSchema.methods.comparePassword = function (candidatePassword, cd) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cd(err)
    cd(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
