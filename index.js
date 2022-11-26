const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k9jkjo0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const Category = client.db("reVisual").collection("category");
    const allProduct = client.db("reVisual").collection("allProducts");
    const myBooking = client.db("reVisual").collection("myBooking");
    const userCollection = client.db("reVisual").collection("user");
    app.get("/category", async (req, res) => {
      const query = {};
      const users = await Category.find(query).toArray();
      res.send(users);
    });
    app.post("/allProduct", async (req, res) => {
      const allProducts = req.body;
      const result = await allProduct.insertOne(allProducts);
      res.send(result);
    });

    app.get("/allProduct", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const allProducts = await allProduct.find(query).toArray();
      res.send(allProducts);
    });

    app.get("/allProduct", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const role = req.query.role;
      const query = { role: role };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/myOrder", async (req, res) => {
      const myOrder = req.body;
      const result = await myBooking.insertOne(myOrder);
      res.send(result);
    });
    app.get("/myOrder", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await myBooking.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((e) => console.log(e));

app.get("/", (req, res) => {
  res.send("reVisual is Runing");
});

app.listen(port, () => {
  console.log(`reVisual Listening On to Port ${port}`);
});
