const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;


// middleware
app.use(cors({
    origin: [
        'https://assignment-11-tws.web.app',
        'https://assignment-11-ea5b1.firebaseapp.com'
    ],
    credentials: true
}));
app.use(express.json());

console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlyyget.mongodb.net/?retryWrites=true&w=majority`;

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

        // Database collecting Name 
        const tabJobsCollection = client.db('assignment-11-jwt').collection('webDevelopment');
        const digitalMarketCollection = client.db('assignment-11-jwt').collection('digitalMarketing');
        const graphicsDesignCollection = client.db('assignment-11-jwt').collection('graphicsDesign');

        const bitWebCollection = client.db('assignment-11-jwt').collection('bitWeb');

        // collection for add job
        const addJobCollection = client.db('assignment-11-jwt').collection('addJob');


        // web development data show tabs
        app.get('/webDevelopment', async (req, res) => {
            const browseJob = tabJobsCollection.find();
            const jobResult = await browseJob.toArray();
            res.send(jobResult);
        });

        app.get('/bitWeb', async (req, res) => {
            const browseJob = bitWebCollection.find();
            const jobResult = await browseJob.toArray();
            res.send(jobResult);
        });

        // web digitalMar data show tabs
        app.get('/digitalMar', async (req, res) => {
            const browseJob = digitalMarketCollection.find();
            const jobResult = await browseJob.toArray();
            res.send(jobResult);
        });

        // graphics data show tabs
        app.get('/graphicsDesign', async (req, res) => {
            const browseJob = graphicsDesignCollection.find();
            const jobResult = await browseJob.toArray();
            res.send(jobResult);
        });


        // digital marketing data show in tabs
        app.get('/digitalMarketing', async (req, res) => {
            const digitalJob = digitalMarketCollection.find();
            const jobResult = await digitalJob.toArray();
            res.send(jobResult);
        });

        // graphics design data receive from database
        app.get('/graphics', async (req, res) => {
            const graphics = graphicsDesignCollection.find();
            const jobResult = await graphics.toArray();
            res.send(jobResult);
        });


        app.get('/webDevelopment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                project: { jobTitle: 1, priceRange: 1, service_id: 1, img: 1 }
            }
            const result = await tabJobsCollection.findOne(query, options);
            res.send(result);
        });

        // for digital marketing
        app.get('/digitalMar/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                project: { jobTitle: 1, priceRange: 1, service_id: 1, img: 1 }
            }
            const result = await digitalMarketCollection.findOne(query, options);
            res.send(result);
        });
        // for graphics design
        app.get('/graphicsDesign/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                project: { jobTitle: 1, priceRange: 1, service_id: 1, img: 1 }
            }
            const result = await graphicsDesignCollection.findOne(query, options);
            res.send(result);
        });

        // bid data send to MongoDB
        app.post('/bitWeb', async (req, res) => {
            const product = req.body;
            const result = await bitWebCollection.insertOne(product);
            res.send(result);
        });


        // delete data from client side and server side
        app.delete('/bitWeb/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bitWebCollection.deleteOne(query);
            res.send(result);
        });


        // add job to MongoDB
        app.post('/addJob', async (req, res) => {
            const product = req.body;
            const result = await addJobCollection.insertOne(product);
            res.send(result);
        });


        // add job from MongoDB
        app.get('/addJob', async (req, res) => {
            const cursor = addJobCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        // delete from server
        app.delete('/addJob/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addJobCollection.deleteOne(query);
            res.send(result);
        });

        // update add product
        app.get('/addJob/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addJobCollection.findOne(query);
            res.send(result);
        });

        // update client data
        app.put('/addJob/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateData = req.body;

            const addProduct = {
                $set: {
                    description: updateData.description,
                    jobTitle: updateData.jobTitle,
                    deadline: updateData.deadline,
                    category: updateData.category,
                    minPrice: updateData.minPrice,
                    maxPrice: updateData.maxPrice
                }
            }

            const result = await addJobCollection.updateOne(filter, addProduct, options);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Assignment 11 Server is Running');
});

app.listen(port, () => {
    console.log(`Example Server is running on port ${port}`);
});
