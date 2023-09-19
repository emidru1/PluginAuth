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

app.get('/api/licenses/:id', async (req, res) => {
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
    const result = await User.findById({_id: req.params.id}).exec();
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
// TODO: Add software CRUD
/*
Get all
Get by id
post create new
Put update one
delete one
*/
// Software CRUD

// Get all softwares
app.get('/api/softwares', async (req, res) => {
  try {
    const result = await Software.find({}).exec();
    if(result.length === 0 ) {
      return res.status(404).send("No software entries were found in the database");
    }
    return res.status(200).send(result);

  } catch (err) {
    console.log(err);
    return res.status(400).send("Internal server error");
  }
});

// Get software data that corresponds to provided id
app.get('/api/softwares/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).send("Invalid softwareId provided");
  }
  try {
    const software = await Software.findById(req.params.id);
    if(!software) {
      return res.status(404).send("No software was found in the database with the provided id");
    }
    return res.status(200).send(software);

  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

app.post('/api/softwares', async (req, res) => {
  try {
    const software = new Software({
      name: req.body.name,
      version:  req.body.version,
      description: req.body.description,
      price: req.body.price,
      createdAt: req.body.createdAt
    });

    const result = await software.save();
    if(!result) {
      return res.status(404).send("Software was not added to the database");
    }
    return res.status(200).send("Software successfully added to the database");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});
app.put('/api/softwares', async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(404).send("Invalid softwareId provided");
  }
  try {
    let updates = {};

    if(req.body.name){
      updates.name = req.body.name;
    }
    if(req.body.version){
      updates.version = req.body.version;
    }
    if(req.body.description){
      updates.description = req.body.description;
    }
    if(req.body.price){
      updates.price = req.body.price;
    }
    const result = await Software.updateOne({ _id: req.body._id }, {$set: updates});
    if(result.nModified === 0) {
        return res.status(404).send("No software entries were updated in the database");
    }
    return res.status(200).send(result);

  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }

});

app.delete('/api/softwares', async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(404).send("Invalid softwareId provided");
  }
  try {
    const result = await Software.deleteOne({ _id: req.body._id });
    if(result.deletedCount === 0) {
      return res.status(404).send("No software entries were deleted in the database");
    }
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

/* 
TODO:
Crud updates:
Get all licenses of a software
Get all users using X software
Get all user X's licenses
*/

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
