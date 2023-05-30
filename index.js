const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());


console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.syvc8b9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();

    const toysCollection = client.db('toyCollections').collection('toys');

    const mathToysCollection = client.db('toyCollections').collection('mathToys');

    const allToysCollection = client.db('toyCollections').collection('allToys');

    const myToysCollection = client.db('toyCollections').collection('myToys');

    // load engineering toys
    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      // const options = {
      //     projection: { toyName:1, toyImg:1, price: 1, rating: 1 },ver
      //   };

      const result = await toysCollection.findOne(query);
      res.send(result);
    })

    // load math toys data
    app.get('/mathToys', async (req, res) => {
      const cursor = mathToysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/mathToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await mathToysCollection.findOne(query);
      res.send(result);
    })

    // sen
    app.post('/toy', async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await myToysCollection.insertOne(newToy);
      res.send(result);
    })

    app.get('/toy', async (req, res) => {
      const cursor = myToysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // update toy
    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await myToysCollection.findOne(query);
      res.send(result);
    })

    app.put('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          toyName: updatedToy.toyName,
          url: updatedToy.url,
          price: updatedToy.price,
          seller: updatedToy.seller,
          category: updatedToy.category,
          quantity: updatedToy.quantity,
          rating: updatedToy.rating,
          email: updatedToy.email
        }
      }
      const result = await myToysCollection.updateOne(filter, toy, option);
      res.send(result);
    })


    // delete toy
    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await myToysCollection.deleteOne(query);
      res.send(result);
    })


    app.get('/allToys', async (req, res) => {
      const cursor = allToysCollection.find();
      const result = await cursor.limit(20).toArray();
      res.send(result)
    })

    app.get('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToysCollection.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Marketplace is running')
})

app.listen(port, () => {
  console.log(`Toy marketplace Server is running on port : ${port}`)
})
