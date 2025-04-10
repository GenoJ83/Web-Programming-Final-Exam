import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import mockApi from '../utils/mockData';

const steps = ['Parent Information', 'Child Information', 'Program Selection', 'Review & Submit'];

const Enrollment = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Parent Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Child Information
    childFirstName: '',
    childLastName: '',
    dateOfBirth: '',
    gender: '',
    allergies: '',
    medicalConditions: '',
    
    // Program Selection
    programType: '',
    startDate: '',
    schedule: '',
    additionalNotes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create enrollment record
      await mockApi.createEnrollment({
        ...formData,
        parentId: user.id,
        status: 'pending'
      });
      showSnackbar('Enrollment submitted successfully! We will contact you soon.');
      // Reset form or redirect
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        childFirstName: '',
        childLastName: '',
        dateOfBirth: '',
        gender: '',
        allergies: '',
        medicalConditions: '',
        programType: '',
        startDate: '',
        schedule: '',
        additionalNotes: ''
      });
      setActiveStep(0);
    } catch (error) {
      showSnackbar(error.message || 'Error submitting enrollment', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="emergencyContact"
                label="Emergency Contact Name"
                value={formData.emergencyContact}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="emergencyPhone"
                label="Emergency Contact Phone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="childFirstName"
                label="Child's First Name"
                value={formData.childFirstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="childLastName"
                label="Child's Last Name"
                value={formData.childLastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="allergies"
                label="Allergies (if any)"
                value={formData.allergies}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="medicalConditions"
                label="Medical Conditions (if any)"
                value={formData.medicalConditions}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Program Type</InputLabel>
                <Select
                  name="programType"
                  value={formData.programType}
                  onChange={handleChange}
                  label="Program Type"
                >
                  <MenuItem value="fullDay">Full Day Program</MenuItem>
                  <MenuItem value="halfDay">Half Day Program</MenuItem>
                  <MenuItem value="afterSchool">After School Program</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="startDate"
                label="Preferred Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Schedule</InputLabel>
                <Select
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  label="Schedule"
                >
                  <MenuItem value="mondayToFriday">Monday to Friday</MenuItem>
                  <MenuItem value="mondayWednesdayFriday">Monday, Wednesday, Friday</MenuItem>
                  <MenuItem value="tuesdayThursday">Tuesday, Thursday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="additionalNotes"
                label="Additional Notes"
                value={formData.additionalNotes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Parent Information
            </Typography>
            <Typography paragraph>
              Name: {formData.firstName} {formData.lastName}
              <br />
              Email: {formData.email}
              <br />
              Phone: {formData.phoneNumber}
              <br />
              Address: {formData.address}
              <br />
              Emergency Contact: {formData.emergencyContact}
              <br />
              Emergency Phone: {formData.emergencyPhone}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Child Information
            </Typography>
            <Typography paragraph>
              Name: {formData.childFirstName} {formData.childLastName}
              <br />
              Date of Birth: {formData.dateOfBirth}
              <br />
              Gender: {formData.gender}
              <br />
              Allergies: {formData.allergies || 'None'}
              <br />
              Medical Conditions: {formData.medicalConditions || 'None'}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Program Details
            </Typography>
            <Typography paragraph>
              Program Type: {formData.programType}
              <br />
              Start Date: {formData.startDate}
              <br />
              Schedule: {formData.schedule}
              <br />
              Additional Notes: {formData.additionalNotes || 'None'}
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Child Enrollment
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit Enrollment
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Enrollment; 