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
    required: [true, 'user required']
  },
  eventDate: {
    dateStart: {
      type: Date,
      required: [true, 'Start day required']
    },
    dateEnd: {
      type: Date
    }
  },
  eventTime: {
    fullDay: Boolean,
    timeStart: Date,
    timeEnd: Date
  },
  adresse: String,
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
    type: String,
    required: [true, 'Age range required']
  },
  domain: {
    type: String,
    required: [true, 'Domain required']
  },
  email: String,
  website: String,
  isActive: {
    type: Boolean,
    default: false,
    required: [true, 'Event state required']
  },
  images: Array,
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Post', PostSchema)
