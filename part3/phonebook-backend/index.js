require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())


let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
    let count = persons.length
    let date = Date()
    response.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${date}</p>
        `
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const startCount = persons.length
    persons = persons.filter(person => person.id !== id)

    if (startCount != persons.length) {
        response.status(204).end()
    } else {
        response.status(404).json({
            error: 'index not found'
        })
    }
})

const generateId = () => Math.floor(1000 * Math.random())

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    // if (!body.name) {
    //     return response.status(400).json({
    //         error: 'name missing'
    //     })
    // }
    // if (!body.number) {
    //     return response.status(400).json({
    //         error: 'number missing'
    //     })
    // }

    // if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    // const person = {
    //     id: generateId(),
    //     name: body.name,
    //     number: body.number
    // }

    // persons = persons.concat(person)
    // console.log(body);
    // response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})