import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const BabysitterRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hourlyRate: '',
    experience: '',
    availability: [],
    workingDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    shifts: [],
  });

  const [shiftType, setShiftType] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');

  // Fixed rates
  const HALF_DAY_RATE = 2000; // Example fixed rate for half day
  const FULL_DAY_RATE = 5000; // Example fixed rate for full day

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleWorkingDayChange = (day) => (e) => {
    setFormData({
      ...formData,
      workingDays: {
        ...formData.workingDays,
        [day]: e.target.checked,
      },
    });
  };

  const handleAddShift = () => {
    if (!shiftType || !shiftDate) return;

    let rate = 0;
    let duration = '';

    if (shiftType === 'half-day') {
      rate = HALF_DAY_RATE;
      duration = 'Half Day (4 hours)';
    } else if (shiftType === 'full-day') {
      rate = FULL_DAY_RATE;
      duration = 'Full Day (8 hours)';
    } else {
      // Custom shift
      if (!shiftStartTime || !shiftEndTime) return;
      const start = new Date(`2000-01-01T${shiftStartTime}`);
      const end = new Date(`2000-01-01T${shiftEndTime}`);
      const hours = (end - start) / (1000 * 60 * 60);
      rate = hours * formData.hourlyRate;
      duration = `${shiftStartTime} - ${shiftEndTime}`;
    }

    const newShift = {
      id: Date.now(),
      date: shiftDate,
      type: shiftType,
      duration,
      rate,
      status: 'pending',
    };

    setFormData({
      ...formData,
      shifts: [...formData.shifts, newShift],
    });

    // Reset shift fields
    setShiftType('');
    setShiftDate('');
    setShiftStartTime('');
    setShiftEndTime('');
  };

  const handleRemoveShift = (shiftId) => {
    setFormData({
      ...formData,
      shifts: formData.shifts.filter((shift) => shift.id !== shiftId),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to your backend
    console.log('Form submitted:', formData);
    // Add your API call here
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Babysitter Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Rate Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Rate Information
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Availability */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Weekly Availability
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {Object.entries(formData.workingDays).map(([day, checked]) => (
                    <Grid item xs={6} sm={4} md={3} key={day}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={handleWorkingDayChange(day)}
                            name={day}
                          />
                        }
                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Schedule Shifts */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Schedule Shifts
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Shift Type</InputLabel>
                      <Select
                        value={shiftType}
                        onChange={(e) => setShiftType(e.target.value)}
                        label="Shift Type"
                      >
                        <MenuItem value="half-day">Half Day (UGX {HALF_DAY_RATE})</MenuItem>
                        <MenuItem value="full-day">Full Day (UGX {FULL_DAY_RATE})</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={shiftDate}
                      onChange={(e) => setShiftDate(e.target.value)}
                    />
                  </Grid>

                  {shiftType === 'custom' && (
                    <>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Start Time"
                          type="time"
                          InputLabelProps={{ shrink: true }}
                          value={shiftStartTime}
                          onChange={(e) => setShiftStartTime(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="End Time"
                          type="time"
                          InputLabelProps={{ shrink: true }}
                          value={shiftEndTime}
                          onChange={(e) => setShiftEndTime(e.target.value)}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<ScheduleIcon />}
                      onClick={handleAddShift}
                      disabled={!shiftType || !shiftDate}
                    >
                      Add Shift
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Added Shifts */}
              {formData.shifts.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Scheduled Shifts:
                  </Typography>
                  <Grid container spacing={1}>
                    {formData.shifts.map((shift) => (
                      <Grid item xs={12} key={shift.id}>
                        <Paper elevation={1} sx={{ p: 1.5 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <ScheduleIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="body1">
                                  {new Date(shift.date).toLocaleDateString()} - {shift.duration}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Rate: ${shift.rate.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveShift(shift.id)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register Babysitter
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BabysitterRegistration;