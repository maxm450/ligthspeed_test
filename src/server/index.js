const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const myParser = require("body-parser");

const app = express();

app.use(express.static('dist'));
app.use(myParser.urlencoded({extended : true}));

MongoClient.connect('mongodb://root:aLgGVCcIW6D5eRoRci@ds147411.mlab.com:47411/lightspeed-test', (err, database) => {
  if (err) {
    return console.log(err)
  }

  db = database.db("lightspeed-test");

  app.listen(8080, () => {
    console.log('listening on 8080')
  })
});

app.get('/api/contacts', (req, res) => {
    db.collection('contacts').find().toArray((err, result) => {
        if (err) {
            res.status(400);
        }

        res.status(200).send({contacts: result});
    })
})

app.post('/api/contacts', (req, res) => {
    var myobj = req.body;

    console.log("debug");
    console.log(req);
    console.log("debug2");
    console.log(myobj);

    db.collection('contacts').insertOne(myobj, function(err, result) {
        if (err) {
            res.status(400);
        }

        res.status(200).send({contact: result});
  });
})

app.get('/api/contacts/:id', (req, res) => {
    const id = req.params.id;

    if (id === null || !ObjectId.isValid(id)) {
        res.status(400).send({message: "bad request"});
        return;
    }

    db.collection('contacts').find({ _id: ObjectId(id) }).toArray((err, result) => {
        if (err) {
            res.status(400);
        }

        res.status(200).send({contact: result.length > 0 ? result[0] : {}});
    })
})

app.delete('/api/contacts/:id', (req, res) => {
    const id = req.params.id;

    if (id === null || !ObjectId.isValid(id)) {
        res.status(400).send({message: "bad request"});;
        return;
    }

    db.collection('contacts').remove({ _id: ObjectId(id) }, function(err, result) {
        if (err) {
            res.status(400).send({message: "bad request"});
        }

        if (result.length === 0) {
            res.status(204).send();
        }

        res.status(200).send({message: "Contact deleted successfully"});
    })
})

app.post('/api/contacts/:id', (req, res) => {
    const id = req.params.id;

    var myobj = req.body;
    console.log("debug2");
    console.log(myobj);

    if (id === null || !ObjectId.isValid(id)) {
        res.status(400).send({message: "bad request"});
        return;
    }

    const newvalues = { $set: req.body };

    db.collection('contacts').updateOne({ _id: ObjectId(id) }, newvalues, function(err, result) {
        if (err) {
            res.status(400);
        }

        res.status(200).send({contact: result.length > 0 ? result[0] : {}});
    });
})
