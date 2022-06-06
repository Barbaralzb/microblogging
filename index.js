const express = require('express')
const cors = require('cors')
const app = express()

// esto es un midleware :
// es una funcion que intercepta (detiene)
// la peticion que esta pasando por mi API
// use : sig que cualquier peticion pasara por aca
app.use(express.json())
app.use(cors())

let notes = [
  {
    id: 1,
    content: 'hello',
    important: true
  },
  {
    id: 2,
    content: 'bye',
    important: false
  }

]

app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

// los : es la forma dinamica de recuperar un segmento del path
app.get('/api/notes/:id', (req, res) => {
  // necesito tranformar lo que voy a escribir en la URL a numero, ya que todo que lo se escribe en la URL
  // es coinciderado como string
  const id = Number(req.params.id)
  console.log(id)
  const note = notes.find(note => note.id === id)
  console.log(note)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
    console.log('there is not that note here')
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.find(note => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  if (!note || !note.content) {
    // 400 es el error que suele dar cuando se crea mal un recurso
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  // Voy a armar mi documento a crear un post
  const newNote = {
    id: maxId + 1,
    // aca utilizo note porque arriba dije que el
    // body de mi request esta almacenado en note
    content: note.content,
    // una validacion
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('estoy en el ' + PORT)
})
