const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.rhysynp.mongodb.net/registrationFormDB`)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error: ", err));

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/index.html"));
});

// Corrected route path from /registar to /register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Registration.findOne({ email: email });

    // Check for existing user
    if (!existingUser) {
      const registrationData = new Registration({ name, email, password });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exists");
      res.redirect("/userexists");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/success.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/error.html"));
});

app.get("/userexists", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/userexists.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
