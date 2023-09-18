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
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
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

//Licenses CRUD
//Get all licenses
app.get('/api/licenses', async (req, res) => {
  try {
    const result = await License.find({}).exec(); // Using exec() to turn it into a real promise
    if (result.length === 0) {
      return res.status(404).send('No licenses found in the database');
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/api/licenses:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send("Invalid license id provided");
  }
  try {
    const result = await License.find({}).exec(); // Using exec() to turn it into a real promise
    if (result.length === 0) {
      return res.status(404).send('No licenses found in the database');
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

// Add license to the database
app.post('/api/licenses', async (req, res) => {
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

// Delete license from the database
app.delete('/api/licenses', async (req, res) => {
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

// Update license entry in the database
app.put('/api/licenses', async (req, res) => {
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
app.put('/api/username', async (req, res) => {
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
});

//Users CRUD
//Get all users
app.get('/api/users', async (req, res) => {
    try {
      const result = await User.find({}).exec();
      if (result.length === 0) {
        return res.status(404).send("No users found in the database");
      }
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
});

//Get user data that corresponds to id (for example: 507f1f77bcf86cd799439011)
app.get('/api/users/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send("Invalid userId provided");
  }
  try {
    const result = await User.find({_id: req.params.id}).exec();
    if (result.length === 0) {
      return res.status(404).send("No user found in the database with provided userid");
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });
    const result = await user.save();
    if(result.length === 0) {
      return res.status(404).send("User has not been created successfully");
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

//Update user information
app.put('/api/users', async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(404).send("Invalid userId provided");
  }
  try {
    const userId = req.body._id;
    let updates = {};
    if (req.body.email) {
      updates.email = req.body.email;
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); 
      updates.password = hashedPassword;
    }
    if (req.body.role) {
      updates.role = req.body.role;
    }
    const result = await User.updateOne({ _id: userId }, { $set: updates });
    if (result.nModified === 0) {
      return res.status(404).send("No user was updated");
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

app.delete('/api/users', async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(404).send("Invalid userId provided");
  }
  try {
    const userId = req.body._id;
    const result = await User.deleteOne({ _id: userId});
    if(result.deletedCount === 0) {
      return res.status(404).send("No users were deleted corresponding to that userId");
    }
    return res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

/*
Login and registration should both either use OAUTH2(If using 3rd party logins) 
or JWT tokens for login
*/

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
