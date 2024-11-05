const mongoose = require('mongoose')
require('dotenv').config()

const atlasUrl = process.env.MONGODB_CONNECT_URL

const connectAtlas = () => {
  console.log('tentando conectar ao atlas')
  mongoose
    .connect(atlasUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('conectado ao atlas')
    })
    .catch(() => {
      console.log('erro ao conectar ao atlas')
    })
}

module.exports = {
  connectAtlas
}
