const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Ucco = require('./models/ucco')

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

morgan.token('tietoja', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :tietoja :status :res[content-length] - :response-time ms'))

app.get('/api', (req, res) => {
  res.send('<h1>Tehtävä osa 3!</h1>')
})

app.get('/api/persons', (req, res) => {
  Ucco
    .find({})
    .then(uccos => {
      res.json(uccos.map(Ucco.formatoi))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Ucco
    .findById(req.params.id)
    .then(jaba => {
      if(jaba === null) {
        return res.status(404).end()
      } else {
        return res.json(Ucco.formatoi(jaba))
      }
    })
})

app.get('/info', (req,res) => {
  const paiva = new Date()
  Ucco
    .find({})
    .then(result => {
      res.send('puhelinluettelossa ' +  result.length + ' henkilön tiedot '+ '<br>' + '<br>' + paiva)
    })
})

app.post('/api/persons', (request,res) => {
  const body = request.body

  if (body.name === '' || body.number === '') {
    return res.status(400).send({ error: 'name or number missing' })
  }

  const person = new Ucco( {
    name: body.name,
    number: body.number
  })

  Ucco
    .find({ name: person.name })
    .then(name => {
      if(name.length === 0){
        person
          .save()
          .then(savedPerson => {
            res.json(Ucco.formatoi(savedPerson))
          })
      }else {
        return res.status(400).send({ error: 'name must be unique' })
      }
    })
})

app.put('/api/persons/:id', (req,res) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Ucco
    .findByIdAndUpdate(req.params.id, person, { new : true })
    .then(savedPerson => {
      res.json(Ucco.formatoi(savedPerson))
    })
})

app.delete('/api/persons/:id', (request, res) => {
  Ucco
    .findByIdAndRemove(request.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(() => {
      res.status(400).send({ error : 'väärä id' })
    })
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

