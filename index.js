const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const fileUpload = require('express-fileupload');
const app = express()
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gbmds.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("creativeAgency").collection("services");
  const adminCollection = client.db("creativeAgency").collection("admin");
  const orderCollection = client.db("creativeAgency").collection("order");
  const reviewCollection = client.db("creativeAgency").collection("review");
  
    // Add Service
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // Add Admin
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // Add Order
    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const projectTitle = req.body.projectTitle;
        const projectDetails = req.body.projectDetails;
        const price = req.body.price;
        const status = req.body.status;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
    
        var image = {
          contentType: file.mimetype,
          size: file.size,
          img: Buffer.from(encImg, 'base64')
        };
    
        orderCollection.insertOne({ name, email, projectTitle, projectDetails, price, status, image})
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    
    })

    // Add Review
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // Order List For Admin
    app.get('/fullOrderList', (req, res) => {
        orderCollection.find({})
            .toArray((error, document) => {
                res.send(document);
            })
    })

    // Order Card
    app.post('/orderCard', (req, res) => {
        const email = req.body.email;
        orderCollection.find({email: email})
            .toArray((error, document) => {
                res.send(document);
            })
    })

    // Check Admin
    app.post('/isAdmin', (req, res)=>{
        const email = req.body.email;
        adminCollection.find({email: email})
            .toArray((error, admin)=>{
                res.send(admin.length > 0)
            })
    })

    // Order Card
    app.post('/orderCard', (req, res) => {
        const email = req.body.email;
        orderCollection.find({email: email})
            .toArray((error, document) => {
                console.log(document);
                res.send(document);
            })
    })

    // Service List
    app.get('/service', (req, res) => {
        serviceCollection.find({})
            .toArray((error, document) => {
                res.send(document);
            })
    })

    // Review List
    app.get('/reviewList', (req, res) => {
        reviewCollection.find({})
            .toArray((error, document) => {
                res.send(document);
            })
    })

});

app.get('/', (req, res) => {
    res.send("Hello from Creative Server");
})

app.listen(process.env.PORT || port);