const authRoutes = require('./routes/authRoutes');
const childRoutes = require('./routes/childRoutes');
const babysitterRoutes = require('./routes/babysitterRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/babysitters', babysitterRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/schedules', scheduleRoutes); 