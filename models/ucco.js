const mongoose = require('mongoose')
const Schema = mongoose.Schema

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url,{ useNewUrlParser: true })

const uccoSchema = new Schema({ name: String,number: String,id: Number })

uccoSchema.statics.formatoi = function(name) {
  return {
    name: name.name,
    number: name.number,
    id: name._id
  }
}

const Ucco = mongoose.model('Ucco', uccoSchema)

module.exports = Ucco