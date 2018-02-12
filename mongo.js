const mongoose = require('mongoose')

const DB_PASSWORD = process.env.DB_PASSWORD
const url = `mongodb://puhelinluettelo:${DB_PASSWORD}@ds129706.mlab.com:29706/puhelinluettelo`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

function savePerson(person) {
  const dbObject = new Person(person)
  dbObject
    .save()
    .then(result => {
      console.log('person saved:', JSON.stringify(person))
      mongoose.connection.close()
    })
}

function findPersons() {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log('person:', JSON.stringify(person))
      })
      mongoose.connection.close()
    })
}

const name = process.argv[2]
const number = process.argv[3]

if (name && number) {
  console.log('lisätään henkilö %s numero %s luetteloon', name, number)
  savePerson({name, number})
} else {
  console.log('puhelinluettelo:')
  findPersons()
}
