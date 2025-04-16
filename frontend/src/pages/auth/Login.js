import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
} from '@mui/material';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     
      try {
        const response = await axios.post('http://localhost:4400/login', formData);

        console.log(response.data);
        if (response.status === 200) {
          alert(response.data.message);
          // Get the role from the response
          const role = response.data.role;
          console.log("User role:", role);

          // Save role to localStorage or context
          localStorage.setItem("userRole", role);

          // Navigate based on role
          if (role === 'parent') {
            navigate("/dashboard/parent");
          } else if (role === 'manager' || role === 'babysitter') {
            navigate("/dashboard/staff");
          } else if (role === 'admin') {
            navigate("/dashboard/admin");
          }
        }
      } catch (error) {
        // Handle error responses from the backend
        if (error.response) {
          alert(error.response.data.error || 'An error occurred');
        } else {
          alert('An error occurred, please try again');
        }
      }
    
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Daystar Daycare
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mt: 2 }}>
            Sign In
          </Typography>

          {(formError) && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
