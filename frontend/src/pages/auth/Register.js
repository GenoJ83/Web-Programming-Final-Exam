import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
} from '@mui/material';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('parent');
  
  // Define steps for the stepper
  const steps = ['Account Information', 'Personal Details', 'Additional Information'];
  
  // Get role from URL query parameter if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['parent', 'manager', 'babysitter'].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [location]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole,
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    // Additional fields for staff
    position: '',
    experience: '',
    qualifications: '',
    // Additional fields for parents
    childrenCount: '',
    specialNeeds: '',
  });

  // Update role in formData when selectedRole changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      role: selectedRole
    }));
  }, [selectedRole]);

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate account information
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
  
    try {
      // Send POST request to backend with the form data
      const response = await axios.post('http://localhost:4400/register', formData);
  
      // Log the response from the backend
      console.log(response.data);
  
      // Check if the response indicates a successful Registered
      if (response.status === 201) {  // Status 201 means "Created" (success)
        alert('Registerion successful');
        navigate('/login');  // Redirect to login page
      } else {
        // Handle case where the backend returned an error or unexpected response
        alert(`Registeration failed: ${response.data.message || 'An error occurred'}`);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('There was an error!', error.message);
      alert('Error in registration!');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            {selectedRole === 'parent' ? (
              <>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Emergency Contact Phone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Number of Children"
                  name="childrenCount"
                  type="number"
                  value={formData.childrenCount}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Special Needs (if any)"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Emergency Contact Phone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'parent':
        return 'Parent Registration';
      case 'manager':
        return 'Manager Registration';
      case 'babysitter':
        return 'Babysitter Registration';
      default:
        return 'Registration';
    }
  };

  const getRoleDescription = () => {
    switch (selectedRole) {
      case 'parent':
        return 'Register as a parent to access your child\'s information and manage your account.';
      case 'manager':
        return 'Register as a manager to access administrative features and oversee daycare operations.';
      case 'babysitter':
        return 'Register as a babysitter to access your schedule and manage your assigned children.';
      default:
        return 'Create your account to access the daycare system.';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {getRoleTitle()}
        </Typography>
        
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          {getRoleDescription()}
        </Typography>
        
        <Tabs
          value={selectedRole}
          onChange={handleRoleChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Parent" value="parent" />
          <Tab label="Manager" value="manager" />
          <Tab label="Babysitter" value="babysitter" />
        </Tabs>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Register
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
          </Box>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
