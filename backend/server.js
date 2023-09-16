require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const License = require('./models/License');
const User = require('./models/User');
const Software = require('./models/Software');
const app = express();

// TODO:
// Key requirements
// User model (username, start date, expiry date later)
// Validation depending on model using express-validator npm
// Build runelite/devious, make a key input form + button, send response of validation to in game chat

app.use(helmet());
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
// enabling CORS for all requests
app.use(cors());
// adding morgan to log HTTP requests
app.use(morgan('combined'));
mongoose.set('strictQuery', true);
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Get all information from the collection
// From  database collection, find ALL items in that collection
// Return values as an array
app.get('/api/getAll', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION_LICENSE);
    
    const col = await collection.find().toArray();
    client.close();
    
    if (col && col.length > 0) {
      res.status(200).send(col);
    } else {
      res.status(400).send('400 Bad Request');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Check if the given key is present in the databas
// If key exists, response is not null, and it returns username associated with the key
// Otherwise, response is null, and it returns null, aka key doesnt exist

// TODO:
// Validation of the key:
// 1. Key requirements
// 2. If key doesnt meet key requirement ruleset - bad request (to prevent bruteforcing)
app.post('/api/validateKey', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION_LICENSE);
    const toFind = { key: req.body.key };
    console.log(req.body.key);
    
    const resp = await collection.findOne(toFind);
    if (resp?.username) {
      res.status(200).send(resp.username);
    } else {
      res.status(400).send('400 Bad Request');
    }
    
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Insert key to the database
// TODO: 
// Request body validation
app.post('/api/addLicense', async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const softwareId = new mongoose.Types.ObjectId(req.body.softwareId);
  try {
    const license = new License({
      userId: userId,
      softwareId: softwareId,
      expirationDate: req.body.expirationDate,
      key: req.body.key,
      createdAt: req.body.createdAt
    });
    await license.save();
    
    res.status(200).send("License has been successfully inserted to the database");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete key from the database
app.delete('/api/deleteLicense', async (req, res) => {
  try {
      const licenseKey = req.body.key;
      if (!licenseKey) {
          return res.status(400).send("Must provide license key");
      }

      const result = await License.deleteOne({ key: licenseKey });
      if (result.deletedCount === 0) {
          return res.status(404).send("License not found");
      }

      res.status(200).send("License successfully deleted from the database");
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

// Update old license entry with new license entry
app.put('/api/updateLicense', async (req, res) => {
  try {
    const { newLicense, oldLicense } = req.body;
    if (!newLicense) {
      return res.status(400).send('Must provide new license key');
    }
    const result = await License.updateOne({ key: oldLicense }, { $set: { key: newLicense } });
    
    if (result.nModified === 0) {
      return res.status(404).send("No license found to update");
    }
    res.status(200).send("Successfully updated license key in the database");

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update old username entry with new username entry using key as parameter

app.put('/api/updateUsername', async (req, res) => {
  try {
    const { newUsername, oldUsername } = req.body;
    if(!newUsername) {
      return res.status(400).send('Must provide new username');
    }
    const result = await User.updateOne({ key: req.body.oldUsername }, { $set: { username: newUsername}});
    if (result.nModified === 0) {
      return res.status(404).send("No username found to update");
    }
    res.status(200).send("Successfully updated username in the database");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
/*
Login and registration should both either use OAUTH2(If using 3rd party logins) 
or JWT tokens for login
*/
});
app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

app.use('/signup', (req, res) => {
  res.send({
    token: 'test123'
  });
});

// Start server
const port = process.env.PORT;
app.listen(port, () => 
  console.log(`API successfully started on port ${process.env.PORT}`)
);
