const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const myParser = require("body-parser");
const validate = require('express-validation');
const multer  = require('multer')

const upload = multer({ dest: './uploads/' })
const validation = require('./validation');

const app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
    
app.use(allowCrossDomain);
app.use(express.static('dist'));
app.use(myParser.json())
app.use(myParser.urlencoded({extended : true}));

app.use(function(err, req, res, next){
    res.status(400).json(err);
  });

// MongoClient.connect('mongodb://root:aLgGVCcIW6D5eRoRci@ds147411.mlab.com:47411/lightspeed-test', (err, database) => {
//   if (err) {
//     return console.log(err)
//   }

//   db = database.db("lightspeed-test");

//   app.listen(8080, () => {
//     console.log('listening on 8080')
//   })
// });

app.listen(8080, () => {
    console.log('listening on 8080')
  })

app.get('/api/contacts', (req, res) => {
    db.collection('contacts').find().toArray((err, result) => {
        if (err) {
            res.status(400);
        }

        res.status(200).send({contacts: result});
    })
})

app.post('/api/contacts', upload.single('avatar'), (req, res) => {
    var myobj = req.body;

    console.log("body");
    console.log(myobj);

    console.log('Uploaded: ', req.file);

    db.collection('contacts').insertOne(myobj, function(err, result) {
        if (err) {
            res.status(400);
        }

        console.log(result);

        res.status(200).send({contact: result.ops[0]});
    });
})

app.post('/api/contacts/avatar', upload.single('avatar'), (req, res) => {
    //console.log('Uploaded: ', req.file);
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

app.post('/api/contacts/:id', validate(validation.contact), (req, res) => {
    const id = req.params.id;

    if (id === null || !ObjectId.isValid(id)) {
        res.status(400).send({message: "bad request"});
        return;
    }

    const newvalues = { $set: req.body };

    db.collection('contacts').updateOne({ _id: ObjectId(id) }, newvalues, function(err, result) {
        if (err) {
            res.status(400);
        }

        res.status(200).send({contact: req.body});
    });
})
