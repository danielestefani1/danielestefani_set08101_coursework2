//variables
var update = document.getElementById('update')
var del = document.getElementById('delete')




//upon clicking the replace button the previous note is updated with this one
update.addEventListener('click', function () {
  fetch('/notes', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': 'Dan',
      'quote': 'new note'
    })
  }).then(response => {
    if (response.ok) return response.json()
  }).then(data => {
    console.log(data)
  })
})

//on click, the previous replaced note will delete

del.addEventListener('click', function () {
  fetch('notes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'Dan'
    })
  }).then(function (response) {
    window.location.reload()
  })
})

//connecting to the database and deleting the previous note, deleting from the notes database

var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
MongoClient.connect('mongodb://danny:micia@ds231589.mlab.com:31589/blog', function(err, db) {
  // Get the collection
  var col = db.collection('notes');
  col.insertMany([{a:1, b:1}], {w:1}, function(err, r) {
    test.equal(null, err);
    test.equal(1, r.result.n);

    col.findOneAndDelete({a:1}
      , { projection: {b:1}, sort: {a:1} }
      , function(err, r) {
        test.equal(null, err);
        test.equal(1, r.lastErrorObject.n);
        test.equal(1, r.value.b);

        db.close();
    });
  });
});

