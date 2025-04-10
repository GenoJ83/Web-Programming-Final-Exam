import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    enrollment: null,
    financial: null,
    events: null,
    users: null,
    attendance: null
  });

  const fetchData = async () => {
    try {
      const [
        enrollmentRes,
        financialRes,
        eventsRes,
        usersRes,
        attendanceRes
      ] = await Promise.all([
        axios.get('/api/analytics/enrollment'),
        axios.get('/api/analytics/financial'),
        axios.get('/api/analytics/events'),
        axios.get('/api/analytics/users'),
        axios.get('/api/analytics/attendance')
      ]);

      setData({
        enrollment: enrollmentRes.data,
        financial: financialRes.data,
        events: eventsRes.data,
        users: usersRes.data,
        attendance: attendanceRes.data
      });
      setError(null);
    } catch (error) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Enrollment Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enrollment Statistics
            </Typography>
            <Box height={300}>
              <BarChart
                data={data.enrollment?.childrenByAge}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" label={{ value: 'Age', position: 'bottom' }} />
                <YAxis label={{ value: 'Count', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Children" />
              </BarChart>
            </Box>
          </Paper>
        </Grid>

        {/* Financial Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Financial Statistics
            </Typography>
            <Box height={300}>
              <LineChart
                data={data.financial?.revenueByMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.month" />
                <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Revenue" />
              </LineChart>
            </Box>
          </Paper>
        </Grid>

        {/* Event Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Event Statistics
            </Typography>
            <Box height={300}>
              <PieChart>
                <Pie
                  data={data.events?.eventsByType}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.events?.eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>
          </Paper>
        </Grid>

        {/* User Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Statistics
            </Typography>
            <Box height={300}>
              <PieChart>
                <Pie
                  data={data.users?.usersByRole}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.users?.usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>
          </Paper>
        </Grid>

        {/* Attendance Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Statistics
            </Typography>
            <Box height={300}>
              <LineChart
                data={data.attendance?.attendanceByMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Attendance Rate (%)', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendanceRate" stroke="#8884d8" name="Attendance Rate" />
              </LineChart>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard; 