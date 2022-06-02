const express = require('express')
const router = express.Router()

const users = [
  {
    id: 1,
    name: 'Belen',
    phones: {
      home: '800-124-222',
      mobile: '09340394222'
    },
    email: 'belen@gmail.com'
  },
  {
    id: 2,
    name: 'Barbara',
    phones: {
      home: '800-124-111',
      mobile: '09340394111'
    },
    email: 'barbara@gmail.com'
  }
]

router.get('/', function (req, res) {
  res.json(users)
})

module.exports = router
