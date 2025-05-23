const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tkd5xye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const groupsCollection = client.db("hobbyHubDB").collection("groups");

    // POST: Create Group
    app.post("/groups", async (req, res) => {
      const group = req.body;
      const result = await groupsCollection.insertOne(group);
      res.send(result);
    });

    // GET: All Groups
    app.get("/groups", async (req, res) => {
      const result = await groupsCollection.find().toArray();
      res.send(result);
    });

    // GET: Group By ID
    app.get("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const group = await groupsCollection.findOne({ _id: new ObjectId(id) });
      res.send(group);
    });

    // GET: My Groups by Email
    app.get("/myGroups", async (req, res) => {
      const email = req.query.email;
      const result = await groupsCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // PUT: Update Group
    app.put("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const updatedGroup = req.body;
      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedGroup }
      );
      res.send(result);
    });

    // DELETE: Delete Group
    app.delete("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const result = await groupsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // PATCH: Join Group (example only)
    app.patch("/groups/join/:id", async (req, res) => {
      const id = req.params.id;
      const result = await groupsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { joinedCount: 1 } }
      );
      res.send(result);
    });

    // Root Route
    app.get("/", (req, res) => {
      res.send("HobbyHub Server is running");
    });
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run();
