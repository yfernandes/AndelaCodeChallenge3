import express from "express";
import { connect } from "mongoose";
import { json } from "body-parser";
import "dotenv/config";

// Create an Express application
const app = express();

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose models for Album and Purchase (replace with your actual models)
import Album, {
  find,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
} from "./models/Album";
import Purchase from "./models/Purchase";

// Middleware to parse JSON data using body-parser
app.use(json());

// Albums CRUD routes
app.get("/albums", async (req, res) => {
  try {
    // Retrieve a list of all albums
    const albums = await find({});
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

app.get("/albums/:id", async (req, res) => {
  try {
    const album = await findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch album" });
  }
});

app.post("/albums", async (req, res) => {
  try {
    const { title, performer, cost } = req.body;
    const newAlbum = new Album({ title, performer, cost });
    const savedAlbum = await newAlbum.save();
    res.status(201).json(savedAlbum);
  } catch (error) {
    res.status(400).json({ error: "Failed to create album" });
  }
});

app.put("/albums/:id", async (req, res) => {
  try {
    const { title, performer, cost } = req.body;
    const updatedAlbum = await findByIdAndUpdate(
      req.params.id,
      { title, performer, cost },
      { new: true }
    );
    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.status(200).json(updatedAlbum);
  } catch (error) {
    res.status(400).json({ error: "Failed to update album" });
  }
});

app.delete("/albums/:id", async (req, res) => {
  try {
    const deletedAlbum = await findByIdAndDelete(req.params.id);
    if (!deletedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete album" });
  }
});

// Purchase route
app.post("/purchases", async (req, res) => {
  try {
    const { user, album } = req.body;
    const newPurchase = new Purchase({ user, album });
    const savedPurchase = await newPurchase.save();
    // Populate user and album relations with all their data fields
    await savedPurchase.populate("user").populate("album").execPopulate();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(400).json({ error: "Failed to create purchase" });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
