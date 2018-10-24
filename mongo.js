const mongoose = require('mongoose')

const url = 'mongodb://herbert:SALASANATULEETTÄHÄN@ds137643.mlab.com:37643/fullstack-persons'

mongoose.connect(url)

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const Ucco = mongoose.model('Ucco', {
  name: String,
  number: String,
  id: Number
})


const ucconator = (nimi,numero) => new Ucco({
  name: nimi,
  number: numero,
  id: getRandomInt(1,1000000)
})

const tyyppi = ucconator(process.argv[2],process.argv[3])

if(process.argv.length < 3) {
  Ucco
    .find({})
    .then(result => {
      result.forEach(x => {
        console.log(x)
      })
      mongoose.connection.close()
    })
}

if(process.argv.length > 2) {
  tyyppi
    .save()
    .then(() => {
      console.log('lisätään henkilö ', process.argv[2], ' numero ',process.argv[3], ' luetteloon')
      mongoose.connection.close()
    })
}