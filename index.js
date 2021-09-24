const express = require('express')
const app = express()
const cors =require('cors');
const bobyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bobyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

  app.get('/services',(req,res)=>{
    serviceCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })

  })

  app.get('/Reviews',(req,res)=>{
    reviewCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })

  })

  
  app.get('/Orders',(req,res)=>{
    orderCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })

  })

app.get('/service/:id', (req, res) => {
  serviceCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err, documents) => {
          res.send(documents[0]);
      })
})


  app.get('/Order/:email', (req, res) => {
    const email = req.params.email;
    orderCollection.find({email: email})
        .toArray((err, documents) => {
            res.send(documents);
        })
})


  app.post('/addService',(req,res)=>{
      

   const newservice= req.body;
   serviceCollection.insertOne(newservice)
   .then(result=>{
       res.send(result.insertedCount > 0)
   })

  })


  app.post('/addReview',(req,res)=>{
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
 
   })

  
  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
 
   })

  app.post('/addAdmin',(req,res)=>{

    const newAdmin = req.body
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
 
    })

    app.post('/isAdmin', (req, res) => {
      const email = req.body.email;
      adminCollection.find({ email: email })
        .toArray((err, admins) => {
          res.send(admins.length > 0);
        })
    })

app.patch('/update/:id', (req, res) => {
  const updateService=req.body;
  console.log( updateService)
  serviceCollection.updateOne({_id:ObjectId(req.params.id)},
  {
      $set:{title:req.body.title,price:req.body.price,description:req.body.description}
  }
  
  )
  .then(result=>{
      console.log(result)
      res.send(!!result.modifiedCount)
  })
      
})


app.delete('/deleteService/:id', (req, res) => {
  serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result=>{
      res.send(result.deletedCount > 0);
     
  })

})


app.delete('/deleteOrder/:id', (req, res) => {
orderCollection.deleteOne({_id:ObjectId(req.params.id)})
.then(result=>{
    res.send(result.deletedCount > 0);
   
})

})


});

app.listen(port, () => {
  console.log(port)
})