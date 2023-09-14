require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const app = express();
require('mongodb').Logger.setLevel('debug');

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

// Get all information from the collection
// From  database collection, find ALL items in that collection
// Return values as an array
app.get('/api/getAll', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION);
    
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
    const collection = db.collection(process.env.DB_COLLECTION);
    const toFind = { key: req.body.key };
    console.log(req.body.key);
    
    const resp = await collection.findOne(toFind);
    if (resp && resp.username) {
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
app.post('/api', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION);
    
    const toAdd = { username: req.body.username, key: req.body.key };
    const resp = await collection.insertOne(toAdd);
    client.close();
    
    res.status(200).send("Key has been successfully inserted to the database");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete key from the database
app.delete('/api/removeKey', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION);
    
    const toDelete = { key: req.body.key };
    const resp = await collection.deleteOne(toDelete);
    client.close();
    
    if (resp.deletedCount > 0) {
      res.status(200).send("Key has been successfully removed.");
    } else {
      res.status(400).send("400 Bad Request");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update old key entry with new key entry
app.put('/api/updateKey', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION);
    
    const myquery = { key: req.body.key };
    const newvalues = { $set: { key: req.body.replacement } };
    
    const resp = await collection.updateOne(myquery, newvalues, { upsert: true });
    client.close();
    
    res.status(200).send("Successfully updated key in the database");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update old username entry with new username entry using key as parameter

app.put('/api/updateUsername', async (req, res) => {
  try {
    const client = new MongoClient(process.env.URI);
    await client.connect();
    
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.DB_COLLECTION);
    
    const myquery = { key: req.body.key };
    const newvalues = { $set: { username: req.body.username } };
    
    const resp = await collection.updateOne(myquery, newvalues, { upsert: true });
    client.close();
    
    res.status(200).send("Successfully updated username in the database");
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});
// Start server
const port = process.env.PORT;
app.listen(port, () => 
  console.log(`API successfully started on port ${process.env.PORT}`)
);
