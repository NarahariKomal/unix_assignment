const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect('mongodb://mongo:27017/notesdb')
.then(() => console.log("db connected"))
.catch(err => console.log(err))

const noteSchema = new mongoose.Schema({
    text: String
})

const Note = mongoose.model('Note', noteSchema)

app.get('/', async (req, res) => {
    const notes = await Note.find()
    let html = "<h2>Notes</h2><form method='POST' action='/add'><input name='text'/><button>Add</button></form><ul>"

    notes.forEach(n => {
        html += `<li>${n.text}</li>`
    })

    html += "</ul>"
    res.send(html)
})

app.post('/add', async (req, res) => {
    const txt = req.body.text

    if (txt && txt.trim() !== "") {
        await Note.create({ text: txt })
    }

    res.redirect('/')
})

app.listen(3000, () => {
    console.log("server running on 3000")
})