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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const Schedules = () => {
  const [formData, setFormData] = useState({
    childId: '',
    babysitterId: '',
    startDate: new Date(),
    endDate: new Date(),
    sessionType: '',
    paymentMethod: ''
  });

  const [schedules, setSchedules] = useState([]);
  const [children, setChildren] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSchedules();
    fetchChildren();
    fetchBabysitters();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching schedules',
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
      await axios.post('http://localhost:4400/api/schedules', {
        ...formData,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0]
      });
      setSnackbar({
        open: true,
        message: 'Schedule created successfully',
        severity: 'success'
      });
      fetchSchedules();
      setFormData({
        childId: '',
        babysitterId: '',
        startDate: new Date(),
        endDate: new Date(),
        sessionType: '',
        paymentMethod: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error creating schedule',
        severity: 'error'
      });
    }
  };

  const handleUpdatePayment = async (scheduleId, status, transactionReference) => {
    try {
      await axios.put(`http://localhost:4400/api/schedules/${scheduleId}/payment`, {
        status,
        transactionReference
      });
      setSnackbar({
        open: true,
        message: 'Payment status updated successfully',
        severity: 'success'
      });
      fetchSchedules();
      setPaymentDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating payment status',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Schedule Management
        </Typography>

        <Grid container spacing={3}>
          {/* Create Schedule Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create Schedule
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
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
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
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        label="Payment Method"
                        required
                      >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="mobile_money">Mobile Money</MenuItem>
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
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
                      Create Schedule
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Schedules List */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Schedules
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Child</TableCell>
                      <TableCell>Babysitter</TableCell>
                      <TableCell>Period</TableCell>
                      <TableCell>Session</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.childFirstName} {schedule.childLastName}</TableCell>
                        <TableCell>{schedule.babysitterFirstName} {schedule.babysitterLastName}</TableCell>
                        <TableCell>
                          {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{schedule.sessionType}</TableCell>
                        <TableCell>
                          <Chip
                            label={schedule.status}
                            color={getStatusColor(schedule.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={schedule.paymentStatus}
                            color={getPaymentStatusColor(schedule.paymentStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setPaymentDialogOpen(true);
                            }}
                          >
                            Update Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Payment Update Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          {selectedSchedule && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={selectedSchedule.paymentStatus}
                  onChange={(e) => setSelectedSchedule({
                    ...selectedSchedule,
                    paymentStatus: e.target.value
                  })}
                  label="Payment Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Transaction Reference"
                value={selectedSchedule.transactionReference || ''}
                onChange={(e) => setSelectedSchedule({
                  ...selectedSchedule,
                  transactionReference: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleUpdatePayment(
              selectedSchedule.id,
              selectedSchedule.paymentStatus,
              selectedSchedule.transactionReference
            )}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

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

export default Schedules; 