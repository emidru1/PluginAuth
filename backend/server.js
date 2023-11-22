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
const jwt = require('jsonwebtoken');
const path = require('path');


app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
mongoose.set('strictQuery', true);
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// dotenv
//Licenses CRUD
//Get all licenses 

function generateToken(user) {
  const payload = {
    userId: user._id,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Middleware for role checking
function checkRole(allowedRoles) {
  return function(req, res, next) {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Access Denied: Insufficient permissions' });
    }
  };
}

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/api/licenses', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await License.find({}).exec();
    if (result.length === 0) {
      return res.status(404).json({ message: "No licenses found in the database" });
    }
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//Get details of a specified license
app.get('/api/softwares/:softwareId/users/:userId/licenses/:licenseId', authenticateToken, checkRole(['admin', 'premium']), async (req, res) => {
  if (!ObjectId.isValid(req.params.softwareId) || !ObjectId.isValid(req.params.userId) || !ObjectId.isValid(req.params.licenseId)) {
      return res.status(400).json({ error: "Invalid softwareId, userId, or licenseId provided" });
  }

  try {
      const license = await License.findOne({ _id: req.params.licenseId, softwareId: req.params.softwareId, userId: req.params.userId });

      if (!license) {
          return res.status(404).json({ error: "License not found for the provided softwareId, userId, and licenseId" });
      }

      res.status(200).json(license);
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add license to the database
app.post('/api/licenses', authenticateToken, checkRole(['admin']), async (req, res) => {
  const { userId, softwareId, expirationDate, key, createdAt } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(softwareId)) {
    return res.status(400).send('Invalid userId or softwareId provided.');
  }

  try {
    const userExists = await User.findById(userId);
    const softwareExists = await Software.findById(softwareId);

    if (!userExists) {
      return res.status(404).send('User not found.');
    }

    if (!softwareExists) {
      return res.status(404).send('Software not found.');
    }
    const license = new License({
      userId,
      softwareId,
      expirationDate,
      key,
      createdAt
    });

    const savedLicense = await license.save();
    
    await User.updateOne(
      { _id: userId },
      { $addToSet: { softwares: softwareId } }
    );

    await User.updateOne(
      { _id: userId },
      { $addToSet: { licenses: savedLicense._id } }
    );
    return res.status(200).json({ message: "License has been successfully inserted to the database."});
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});





// Delete license from the database
app.delete('/api/licenses', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(licenseId)) {
    return res.status(400).send('Invalid licenseId provided.');
  }
  try {
      const licenseId = req.body._id;
      if (!licenseId) {
          return res.status(400).json({ error: "Must provide license ID" });
      }

      const result = await License.deleteOne({ _id: licenseId });
      if (result.deletedCount === 0) {
          return res.status(404).json({ error: "License not found" });
      }

      const remainingLicenses = await License.find({ softwareId: req.body.softwareId, userId: req.body.userId });
      if(remainingLicenses.length === 0) {
        await User.updateOne(
          { _id: req.body.userId },
          { $pull: { softwares: req.body.softwareId } }
      );
    }
      res.status(200).json({ message: "License has been successfully deleted from the database" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error'});
  }
});

// Update license entry in the database
// Frontend works fine, update all fields that are present (just like in POST request)
// error catching
app.put('/api/licenses', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!ObjectId.isValid(licenseId)) {
    return res.status(400).send('Invalid licenseId provided.');
  }
  try {
    const licenseId = req.body._id;
    if (!licenseId) {
      return res.status(400).json({ error: "Must provide license Id" });
    }
   

    let updates = {};

    if(req.body.userId){
      updates.userId = req.body.userId;
    }
    if(req.body.softwareId){
      updates.softwareId = req.body.softwareId;
    }
    if(req.body.expirationDate){
      updates.expirationDate = req.body.expirationDate;
    }
    if(req.body.key){
      updates.key = req.body.key;
    }
    
    const result = await License.updateOne({ _id: req.body._id }, {$set: updates});
    // Needs debugging. Upon providing invalid license request still goes through, and status is 200, although nothing is updated in the database

    if (result.nModified === 0) {
      return res.status(404).json({ error: "No license found to update" });
    }
    res.status(200).json({ message: "License has been successfully updated in the database" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

//Users CRUD
//Get all users
app.get('/api/users', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
      const result = await User.find({}).exec();
      if (result.length === 0) {
        return res.status(404).json({ error: "No users found in the database" });
      }
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error'});
    }
});
//Get all users using specific software
app.get('/api/softwares/:softwareId/users', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
      const users = await User.find({ softwares: req.params.softwareId });
      if (users.length === 0) {
          return res.status(404).json({ error: "No users found for the provided softwareId" });
      }
      res.status(200).json(users);
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Get user data that corresponds to id (for example: 507f1f77bcf86cd799439011)
app.get('/api/users/:id', authenticateToken, checkRole(['admin', 'premium', 'standart']), async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid userId provided" });
  }
  try {
    const user = await User.findById(req.params.id)
                            .populate('softwares')
                            .populate('licenses')
                            .exec();
    if (!user) {
      return res.status(404).json({ error: "No user found in the database with provided userId" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

// Add new user
app.post('/api/users', authenticateToken, checkRole(['admin']), async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });
    const result = await user.save();
    if(result.length === 0) {
      return res.status(404).json({ error: "User has not been created successfully" });
    }
    return res.status(200).json({message: "User has been successfully added to the database"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

//Update user information
app.put('/api/users', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).json({ error: "Invalid userId provided" });
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
      return res.status(404).json({ error: "No user was updated" });
    }
    return res.status(200).send({ message: "User has been successfully updated in the database" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

app.delete('/api/users', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).json({ error: "Invalid userId provided" });
  }
  try {
    const userId = req.body._id;
    const result = await User.deleteOne({ _id: userId});
    if(result.deletedCount === 0) {
      return res.status(404).json({ error: "No users were deleted corresponding to that userId" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

// Get all softwares
app.get('/api/softwares', authenticateToken, checkRole(['admin', 'premium', 'standart']), async (req, res) => {
  try {
    const result = await Software.find({}).exec();
    if(result.length === 0 ) {
      return res.status(404).json({ error: "No software entries were found in the database" });
    }
    return res.status(200).send(result);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

// Get software data that corresponds to provided id
app.get('/api/softwares/:id', authenticateToken, checkRole(['admin', 'premium', 'standart']), async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid softwareId provided" });
  }
  try {
    const software = await Software.findById(req.params.id);
    if(!software) {
      return res.status(404).json({ error: "No software was found in the database with the provided id" });
    }
    return res.status(200).send(software);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});
// Add software to the database
app.post('/api/softwares', authenticateToken, checkRole(['admin']), async (req, res) => {
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
      return res.status(404).json({ error: "Software was not added to the database" });
    }
    return res.status(200).json({ message: "Software has been successfully added to the database" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});
// Update software in the database
app.put('/api/softwares', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).json({ error: "Invalid softwareId provided" });
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
        return res.status(404).json({ error: "No software entries were updated in the database" });
    }
    return res.status(200).send({ message: "Software has been successfully updated in the database" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

// Remove software from the database
app.delete('/api/softwares', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!ObjectId.isValid(req.body._id)) {
    return res.status(400).json({ error: "Invalid softwareId provided" });
  }
  try {
    const result = await Software.deleteOne({ _id: req.body._id });
    if(result.deletedCount === 0) {
      return res.status(404).json({ error: "No software entries were deleted in the database" });
    }
    return res.status(200).send({ message: "Software has been successfully removed from the database" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

//Get all licenses of a specified software:
app.get('/api/software/:softwareId/licenses', authenticateToken, checkRole(['admin']), async (req, res) => {
  if (!ObjectId.isValid(req.params.softwareId)) {
    return res.status(400).json({ error: "Invalid softwareId provided" });
  }
  try {
    const result = await License.find({ softwareId: req.params.softwareId});
    if(result.length === 0) {
      return res.status(404).json({ error: "No license entries found in the database using the softwareId provided" });
    }
    return res.status(200).send(result);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

//Get specified software specified user's all licenses within the software
app.get('/api/software/:softwareId/users/:userId/licenses', authenticateToken, checkRole(['admin']), async (req, res) => {
    if (!ObjectId.isValid(req.params.softwareId) || !ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ error: "Invalid softwareId or userId provided" });
    }

    try {
        const licenses = await License.find({ softwareId: req.params.softwareId, userId: req.params.userId });

        if (licenses.length === 0) {
            return res.status(404).json({ error: "No licenses found for the provided softwareId and userId" });
        }

        res.status(200).json(licenses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get all selected users licenses
app.get('/api/users/:userId/licenses', authenticateToken, checkRole(['admin', 'premium']), async (req, res) => {
  if(!ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: "Invalid userId provided" });
  }
  try {
    const result = await License.find({ userId: req.params.userId });
    if (result.length === 0) {
      return res.status(404).json({ error: "No licenses found with provided userId" });
    }
    
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});




/* 
Object hierarchy:
Software <- user <- license

API endpoints should be:
/api/entityA/IdA/entityB/IdB/entityC/IdC - done
software should have nested users array - done
users should have nested license array in the database - done
That way endpoint could be: /api/software/softwareId/user/userId/license/licenseId - done

TODO:
Add username to user
Generate license name, for example license-1283091 (unix timestamp?)

When user is removed by administrator, user licenses should be removed aswell (no point in keeping them)
When software is removed, licenses of that software should be removed too (license and in user licenses array)
When updating object entry in the database, validate ID, check if the object exists in the database

Done: Added ObjectId validation in Licenses PUT API method

*/
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid username or password'});;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error'});
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email address already exists'});;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: "standart",
      softwares: [],
      licenses: []
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error'});
  }
});

// Start server

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));  // Use 'build' if that's where your frontend files are
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
