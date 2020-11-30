const mongoose = require('mongoose')
const config = require('config')
const mongoURI = config.get('mongoURI')

const mongoDB = async() => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, { useUnifiedTopology: true })
    console.log("DB Connected...")
  } catch(err){
    console.log(err)
    process.exit(1)
  }
}

module.exports = mongoDB