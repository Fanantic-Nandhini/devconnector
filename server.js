const express = require('express')
const mongoDB = require('./config/db')
const app = express()
const PORT = process.env.PORT || 5000
const cors = require('cors')
const path = require('path')
// connect database
mongoDB();

//init middleware
app.use(cors());
app.use(express.json({ extended: false }))

app.use('/api/user', require('./routes/api/user'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))
app.use('/api/auth', require('./routes/api/auth'))

// Serve for static production
if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'))
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
  console.log(`Server started listening on ${PORT}`)
})