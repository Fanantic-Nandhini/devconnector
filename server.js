const express = require('express')

const mongoDB = require('./config/db')

const app = express()

const PORT = process.env.PORT || 5000

const cors = require('cors')

// connect database
mongoDB();

//init middleware
app.use(cors());
app.use(express.json({ extended: false }))

app.get('/', () => {
  console.log("api running")
})

app.use('/api/user', require('./routes/api/user'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))
app.use('/api/auth', require('./routes/api/auth'))

app.listen(PORT, () => {
  console.log(`Server started listening on ${PORT}`)
})