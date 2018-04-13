const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db
//the code below uses the mongoclient to connect to my mLab online database
MongoClient.connect('mongodb://danny:micia@ds231589.mlab.com:31589/blog', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})
//the viewngine is used to display the web app layout
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('notes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/notes', (req, res) => {
  db.collection('notes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/notes', (req, res) => { //put request to replace the previous note
  db.collection('notes')//added a backslash to add data on the collection
  .findOneAndUpdate({name: 'Dan'}, {//update this user note
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
//this is the delte code to delete the notes from the database
app.delete('/notes', (req, res) => {
  db.collection('notes').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Your notes was wiped')
  })
})





