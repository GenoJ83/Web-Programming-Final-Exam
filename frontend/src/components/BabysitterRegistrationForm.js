import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const BabysitterRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nin: '',
    dateOfBirth: null,
    nextOfKinName: '',
    nextOfKinPhone: '',
    hourlyRate: '',
    experience: '',
    qualifications: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
    const maxAgeDate = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate());

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.nin) newErrors.nin = 'National ID is required';
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (formData.dateOfBirth > minAgeDate) {
      newErrors.dateOfBirth = 'Must be at least 21 years old';
    } else if (formData.dateOfBirth < maxAgeDate) {
      newErrors.dateOfBirth = 'Must be at most 35 years old';
    }
    if (!formData.nextOfKinName) newErrors.nextOfKinName = 'Next of kin name is required';
    if (!formData.nextOfKinPhone) newErrors.nextOfKinPhone = 'Next of kin phone is required';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.qualifications) newErrors.qualifications = 'Qualifications are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:4400/api/babysitters/register', {
        ...formData,
        age: new Date().getFullYear() - formData.dateOfBirth.getFullYear()
      });

      setSnackbar({
        open: true,
        message: 'Babysitter registered successfully',
        severity: 'success'
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nin: '',
        dateOfBirth: null,
        nextOfKinName: '',
        nextOfKinPhone: '',
        hourlyRate: '',
        experience: '',
        qualifications: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error registering babysitter',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Babysitter Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National ID (NIN)"
                name="nin"
                value={formData.nin}
                onChange={handleChange}
                error={!!errors.nin}
                helperText={errors.nin}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next of Kin Name"
                name="nextOfKinName"
                value={formData.nextOfKinName}
                onChange={handleChange}
                error={!!errors.nextOfKinName}
                helperText={errors.nextOfKinName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next of Kin Phone"
                name="nextOfKinPhone"
                value={formData.nextOfKinPhone}
                onChange={handleChange}
                error={!!errors.nextOfKinPhone}
                helperText={errors.nextOfKinPhone}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hourly Rate (UGX)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleChange}
                error={!!errors.hourlyRate}
                helperText={errors.hourlyRate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                error={!!errors.experience}
                helperText={errors.experience}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualifications"
                name="qualifications"
                multiline
                rows={4}
                value={formData.qualifications}
                onChange={handleChange}
                error={!!errors.qualifications}
                helperText={errors.qualifications}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Register Babysitter
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

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

export default BabysitterRegistrationForm; 