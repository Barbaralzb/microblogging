const express = require('express')
const router = express.Router()
router.use(express.json())

let users = [
  {
    id: 1,
    name: 'Belen',
    phones: {
      home: '800-124-222',
      mobile: '09340394222'
    },
    email: 'belen@gmail.com',
    registered: false
  },
  {
    id: 2,
    name: 'Barbara',
    phones: {
      home: '800-124-111',
      mobile: '09340394111'
    },
    email: 'barbara@gmail.com',
    registered: true
  }
]

router.get('/', function (req, res, next) {
  res.json(users)
  next()
})

router.get('/:id', (req, res) => {
  // tengo que acordarme que los endpoints sont string, aunque sea un numero,
  // es por esto que la validacion tiene que ser con un string
  if (req.params.id === '1') {
    res.json(users[1])
  } else {
    res.status(404)
      .send('no se ha encontrado el usuario')
  }
})

router.post('/', (req, res) => {
  const user = req.body
  console.log(user)
  const ids = users.map(user => user.id)
  const maxId = Math.max(...ids)

  const newUser = {
    id: maxId + 1,
    name: user.name,
    mail: user.mail
  }

  users = [...users, newUser]

  res.status(201)
    .send('Usuario ' + req.body.name + 'ha sido añadido correctamente')
    .json(newUser)
})

router.put('/:id', (req, res) => {
  const idUser = Number(req.params.id)
  const user = users.find(user => user.id === idUser)

  const updateUser = {
    name: user.name,
    mail: user.mail
  }
  user.findOneAndUpdate(updateUser)

  res.status(302)
    .send('Usuario ' + req.body.name + ' ha sido encontrado')
    .json(user.name)
})

router.delete('/:id', (req, res) => {
  const idUser = Number(req.params.id)
  users = users.find(user => user.id !== idUser)
  res.status(204)
    .send('Usuario ha sido eliminado')
})
module.exports = router
