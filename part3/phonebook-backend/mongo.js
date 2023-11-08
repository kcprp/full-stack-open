const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://potoks:${password}@full-stack.cj7rjhx.mongodb.net/phoneBookApp
 ?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneBookSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phoneBookSchema)

if (process.argv.length===3) {
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length===5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length===4 || process.argv.length > 5) {
  console.log('Incorrect arguments')
  mongoose.connection.close()
}

