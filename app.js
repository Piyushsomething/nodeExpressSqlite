const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Define Plant model
const Plant = sequelize.define('Plant', {
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  variety: {
    type: DataTypes.STRING,
    allowNull: false
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Define PlantRequest model
const PlantRequest = sequelize.define('PlantRequest', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  plantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  variety: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvalStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  adminComment: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Sync database and add initial data
sequelize.sync({ force: true }).then(async () => {
  console.log('Database & tables created!');

  // Create users
  await User.bulkCreate([
    {
      username: 'admin',
      password: bcrypt.hashSync('admin', 10),
      isAdmin: true
    },
    {
      username: 'abc@gmail.com',
      password: bcrypt.hashSync('abc@gmail.com', 10),
      isAdmin: false
    },
    {
      username: 'user1',
      password: bcrypt.hashSync('user1', 10),
      isAdmin: false
    }
  ]);

  // Add some sample plant data
  await Plant.bulkCreate([
    { area: 'North Field', variety: 'Tomato', availableQuantity: 100 },
    { area: 'South Field', variety: 'Cucumber', availableQuantity: 200 }
  ]);
});

// JWT secret
const jwtSecret = 'pilnu';

// Auth middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Register route
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'User registration failed.' });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, jwtSecret);
    res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
  } else {
    res.status(400).json({ error: 'Invalid username or password.' });
  }
});

// Get all plants
app.get('/plants', authenticateJWT, async (req, res) => {
  const plants = await Plant.findAll();
  res.json({ plants });
});

// Create plant request
app.post('/requests', authenticateJWT, async (req, res) => {
  const { plantId, area, variety, number } = req.body;
  const userId = req.user.id;
  const request = await PlantRequest.create({ userId, plantId, area, variety, number, paymentStatus: false, approvalStatus: false });
  res.json({ message: 'Plant request created successfully!', request });
});

// Get all plant requests (admin only)
app.get('/requests', authenticateJWT, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const requests = await PlantRequest.findAll();
  res.json({ requests });
});

// Get requests for the logged-in user
app.get('/user/requests', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const requests = await PlantRequest.findAll({ where: { userId } });
  res.json({ requests });
});

// Approve or deny plant request (admin only)
app.put('/admin/approve/:id', authenticateJWT, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { id } = req.params;
  const { approvalStatus, adminComment } = req.body;
  const request = await PlantRequest.findByPk(id);
  if (request) {
    request.approvalStatus = approvalStatus;
    request.adminComment = adminComment;
    await request.save();
    res.json({ message: 'Request updated successfully!' });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
