const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/User.js')
const PostSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  title: String,
  description: String,
  publicationdate: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Post', PostSchema)
