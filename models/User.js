const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = require('../models/Post')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10
const UserSchema = new Schema({
  usename: { type: String, require: true, index: { unique: true } },
  password: { type: String, require: true },
  fullname: String,
  email: { type: String, required: true },
  creationdate: { type: Date, default: Date.now },
  role: { type: String, enum: ['admin', 'subscriber'], default: 'suscriber' },
  posts: [{ type: Schema.ObjectId, ref: 'Post', default: null }]
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

module.export = mongoose.model('User', UserSchema)
