const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/User.js')
const PostSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    required: [true, 'user required'],
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'title of event required']
  },
  description: {
    type: String,
    required: [true, 'description of event required']
  },
  dateStart: {
    type: String,
    required: [true, 'Start day required']
  },
  dateEnd: String,
  fullDay: {
    type: Boolean,
    default: false
  },
  timeStart: String,
  timeEnd: String,
  address: String,
  city: {
    type: String,
    required: [true, 'City required']
  },
  postalCode: {
    type: Number,
    min: 10000,
    max: 99999,
    required: [true, 'Code postal required']
  },
  ageRange: {
    type: Array,
    required: [true, 'Age range required']
  },
  domain: {
    color: String,
    label: String,
    id: Number
  },
  email: String,
  website: String,
  facebook: String,
  instagram: String,
  isActive: {
    type: Boolean,
    default: false
  },
  images: [
    {
      url: String,
      key: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Post', PostSchema)
