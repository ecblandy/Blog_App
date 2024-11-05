const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Definindo model
const Categorias = new Schema({
  name: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

// Collection
mongoose.model('categorias', Categorias)
