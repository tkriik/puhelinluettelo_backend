const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body) || '{}'
})

const app = express()
app.use(morgan(':method :url :body'))
app.use(bodyParser.json())
app.use(cors())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]

app.get('/info', (req, res) => {
  const personCount = persons.length
  const timestamp = new Date()
  const html = `
    <div>Puhelinluettelossa ${personCount} henkilön tiedot</div>
    <div>${timestamp}</div>
  `

  res.send(html)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const person = persons.find(p => p.id === id)
  if (!person) {
    res.status(404)
  }

  res.send(person)
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (!person.name) {
    res.status(400).send(error('no name found'))
    return
  }

  if (!person.number) {
    res.status(400).send(error('no number found'))
    return
  }

  if (persons.findIndex(p => p.name === person.name) !== -1) {
    res.status(400).send(error('name must be unique'))
    return
  }

  person.id = generateId()
  persons.push(person)
  res.status(200).send(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const deletedPersonIdx = persons.findIndex(p => p.id === id)
  if (deletedPersonIdx === -1) {
    res.status(404).end()
    return
  }

  persons.splice(deletedPersonIdx, 1)
  res.status(204).end()
})

function generateId() {
  return Math.round(Math.random() * 1000000000)
}

function error(message) {
  return {
    error: message
  }
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Listening on port 3001')
})
