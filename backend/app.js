const express = require('express')
const app = express()

// Serve the public directory
app.use(express.static('public'))

// EJS setup
app.set('view engine', 'ejs')