const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
// const { sequelize } = require('./models');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/trial'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/children', require('./routes/children'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/notifications', require('./routes/notifications'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 