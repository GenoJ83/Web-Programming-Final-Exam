import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const Attendance = () => {
  const [formData, setFormData] = useState({
    childId: '',
    babysitterId: '',
    date: new Date(),
    sessionType: '',
    status: 'present'
  });

  const [attendance, setAttendance] = useState([]);
  const [children, setChildren] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchAttendance();
    fetchChildren();
    fetchBabysitters();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:4400/api/attendance/date/${selectedDate.toISOString().split('T')[0]}`);
      setAttendance(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching attendance',
        severity: 'error'
      });
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/children');
      setChildren(response.data);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const fetchBabysitters = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/babysitters');
      setBabysitters(response.data);
    } catch (error) {
      console.error('Error fetching babysitters:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4400/api/attendance', {
        ...formData,
        date: formData.date.toISOString().split('T')[0]
      });
      setSnackbar({
        open: true,
        message: 'Attendance recorded successfully',
        severity: 'success'
      });
      fetchAttendance();
      setFormData({
        childId: '',
        babysitterId: '',
        date: new Date(),
        sessionType: '',
        status: 'present'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error recording attendance',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Attendance Management
        </Typography>

        <Grid container spacing={3}>
          {/* Record Attendance Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Record Attendance
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Child</InputLabel>
                      <Select
                        name="childId"
                        value={formData.childId}
                        onChange={handleChange}
                        label="Child"
                        required
                      >
                        {children.map((child) => (
                          <MenuItem key={child.id} value={child.id}>
                            {child.firstName} {child.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Babysitter</InputLabel>
                      <Select
                        name="babysitterId"
                        value={formData.babysitterId}
                        onChange={handleChange}
                        label="Babysitter"
                        required
                      >
                        {babysitters.map((babysitter) => (
                          <MenuItem key={babysitter.id} value={babysitter.id}>
                            {babysitter.firstName} {babysitter.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={formData.date}
                        onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Session Type</InputLabel>
                      <Select
                        name="sessionType"
                        value={formData.sessionType}
                        onChange={handleChange}
                        label="Session Type"
                        required
                      >
                        <MenuItem value="half-day">Half Day</MenuItem>
                        <MenuItem value="full-day">Full Day</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                        required
                      >
                        <MenuItem value="present">Present</MenuItem>
                        <MenuItem value="absent">Absent</MenuItem>
                        <MenuItem value="late">Late</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Record Attendance
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Attendance List */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Attendance for {selectedDate.toLocaleDateString()}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </LocalizationProvider>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Child</TableCell>
                      <TableCell>Babysitter</TableCell>
                      <TableCell>Session</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.childName}</TableCell>
                        <TableCell>{record.babysitterName}</TableCell>
                        <TableCell>{record.sessionType}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{record.checkInTime || '-'}</TableCell>
                        <TableCell>{record.checkOutTime || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Attendance; 