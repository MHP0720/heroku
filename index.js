const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.nvsxu.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;



const app = express()

app.use(bodyParser.json());
app.use(cors());


const port = 5000


app.get('/', (req,res) => {
  res.send('hello its working')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const orders = client.db("emaJohnStore").collection("orders");
  // perform actions on the collection object
  console.log('database connected');

app.post('/addProduct',(req, res) => {
    const product = req.body;
    products.insertOne(product)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
})



app.get('/product', (req, res) => {
    products.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
})


app.get('/singleProduct/:key', (req, res) => {
    products.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0]);
    })
})


app.post('/productByKeys', (req,res) => {
  const productKeys = req.body;
  products.find({key: { $in: productKeys}})
  .toArray((err, documents) => {
    res.send(documents);
  })
})



app.post('/addOrder',(req, res) => {
  const order = req.body;
  orders.insertOne(order)
  .then(result => {

      // console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
  })
})

});


app.listen(process.env.PORT || port)