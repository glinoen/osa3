const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Martti Tienari', number: '040-123456', id: 2 },
    { name: 'Arto Järvinen', number: '040-123456', id: 3 },
    { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
]
app.use(bodyParser.json())

morgan.token('tietoja', (req) =>{
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :tietoja :status :res[content-length] - :response-time ms'))

app.get('/api', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if ( person ) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.get('/info', (req,res) => {
    const paiva = new Date()
    res.send('puhelinluettelossa ' +  persons.length + ' henkilön tiedot '+ "<br>" + "<br>" + paiva)
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



app.post('/api/persons', (request,res) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'name or number missing'})
    }

    tutkija = persons.find(person => person.name === body.name)
    if (tutkija) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(1,1000000)
    }

    persons = persons.concat(person)

    res.json(person)
})

app.delete('/api/persons/:id', (request, res) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})

