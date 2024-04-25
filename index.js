const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleeware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.upnu39b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('users')

    //get /read
    app.get('/coffees', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    });

    //POST / create
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    });
    //PUT / update

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          teste: updatedCoffee.teste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photoURL: updatedCoffee.photoURL
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result)
    });

    //Delete
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });


    // ---------user related apis----------
    //------get/read--------
    app.get('/users', async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray()
      res.send(result)

    });

    //---------user post/create---------

    app.post('/users', async(req, res)=>{
      const user = req.body;
      console.log(user)
      const result = await userCollection.insertOne(user);
      res.send(result)
    }
  );

  // ----------put/patch-user Update-----
  app.patch('/users', async(req, res)=>{
    const user = req.body;
    const filter = {email:user.email}
    const updateDoc ={
      $set: {
        lastLoginAt: user.lastLoginAt
      }
    }
    const result =await userCollection.updateOne(filter,updateDoc)
    res.send(result)
  })

//-------user delete---------
app.delete('/users/:id',async(req, res)=>{
  const id = req.params.id
   const query = {_id: new ObjectId(id)} 
  const result = await userCollection.deleteOne(query)
  res.send(result)
});


    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('coffee making server is the runing')
})
app.listen(port, () => {
  console.log(`Coffee Server is running on port: ${port}`)
})