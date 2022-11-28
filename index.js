const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

const jwt = require("jsonwebtoken");

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

// verifyJWT

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}
// verifyJWT

async function run() {
  try {
    const Category = client.db("reVisual").collection("category");
    const allProduct = client.db("reVisual").collection("allProducts");
    const myBooking = client.db("reVisual").collection("myBooking");
    const userCollection = client.db("reVisual").collection("user");

    // verifyAdmin
    const verifyAdmin = async (req, res, next) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await userCollection.findOne(query);
      if (user?.status !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };
    // verifyAdmin

    // verifySeller
    const verifySeller = async (req, res, next) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await userCollection.findOne(query);
      if (user?.role !== "Seller") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };
    // verifySeller
    //verifySeller
    // const verifyBuyer = async (req, res, next) => {
    //   const decodedEmail = req.decoded.email;
    //   const query = { email: decodedEmail };
    //   const user = await userCollection.findOne(query);
    //   if(se)
    // };
    //verifySeller
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

    // allMyProduct

    app.get("/allMyProduct", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const allMyProduct = await allProduct.find(query).toArray();
      res.send(allMyProduct);
    });

    app.delete("/allMyProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allProduct.deleteOne(query);
      res.send(result);
    });

    // allMyProduct

    // Advertisement
    app.put("/advertisement/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          advertisement: "advertised",
        },
      };
      const result = await allProduct.updateOne(filter, updatedDoc, option);
      res.send(result);
    });

    app.get("/showAdvertisement", async (req, res) => {
      const advertisement = req.query.advertisement;
      const query = { advertisement: advertisement };
      const result = await allProduct.find(query).toArray();
      res.send(result);
    });

    // Advertisement

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // admin
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.status === "admin" });
    });
    // admin
    // seller
    app.get("/users/Seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isSeller: user?.role === "Seller" });
    });
    // seller

    // buyer
    app.get("/users/Buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isBuyer: user?.role === "Buyer" });
    });
    // buyer

    app.get("/users", async (req, res) => {
      const role = req.query.role;
      const query = { role: role };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/verification", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          Verification: "verified",
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.get("/profile", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
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

    // myBookings

    app.get("/availableProducts", async (req, res) => {
      const quantity = req.query.quantity;
      const query = {};
      const availableQuery = { availableProduct: quantity };
      const allProducts = await allProduct.find(query).toArray();
      const alreadyBooked = await myBooking.find(availableQuery).toArray();
      allProducts.forEach();
    });

    // myBookings

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "1d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
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
