import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import SchedulingForm from '../components/SchedulingForm';
import axios from 'axios';

const Scheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/schedules');
      setSchedules(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:4400/api/schedules/${id}/status`, {
        status
      });
      fetchSchedules();
    } catch (error) {
      setError('Failed to update schedule status');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Scheduling
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Create Schedule" />
          <Tab label="View Schedules" />
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        <SchedulingForm onSuccess={fetchSchedules} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Child</TableCell>
                <TableCell>Babysitter</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Session Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.childFirstName} {schedule.childLastName}</TableCell>
                  <TableCell>{schedule.babysitterFirstName} {schedule.babysitterLastName}</TableCell>
                  <TableCell>{new Date(schedule.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(schedule.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{schedule.sessionType}</TableCell>
                  <TableCell>{schedule.status}</TableCell>
                  <TableCell>{schedule.paymentStatus}</TableCell>
                  <TableCell>KSH {schedule.amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={schedule.status === 'active' ? 'error' : 'primary'}
                      onClick={() => handleStatusUpdate(schedule.id, schedule.status === 'active' ? 'cancelled' : 'active')}
                    >
                      {schedule.status === 'active' ? 'Cancel' : 'Reactivate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Scheduling; 