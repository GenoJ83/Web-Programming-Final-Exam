import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import mockApi from '../utils/mockData';

function Babysitters() {
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBabysitter, setCurrentBabysitter] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    availability: '',
    qualifications: '',
    status: 'active'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchBabysitters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mockApi.getBabysitters();
      setBabysitters(data);
    } catch (error) {
      console.error('Error fetching babysitters:', error);
      showSnackbar('Failed to fetch babysitters', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBabysitters();
  }, [fetchBabysitters]);

  const handleOpenDialog = (babysitter = null) => {
    if (babysitter) {
      setCurrentBabysitter(babysitter);
      setFormData({
        firstName: babysitter.firstName,
        lastName: babysitter.lastName,
        email: babysitter.email,
        phoneNumber: babysitter.phoneNumber,
        address: babysitter.address || '',
        emergencyContact: babysitter.emergencyContact || '',
        availability: babysitter.availability || '',
        qualifications: babysitter.qualifications || '',
        status: babysitter.status || 'active'
      });
    } else {
      setCurrentBabysitter(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        emergencyContact: '',
        availability: '',
        qualifications: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBabysitter(null);
  };

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
      if (currentBabysitter) {
        await mockApi.updateBabysitter(currentBabysitter.id, formData);
        showSnackbar('Babysitter updated successfully', 'success');
      } else {
        await mockApi.createBabysitter(formData);
        showSnackbar('Babysitter added successfully', 'success');
      }
      handleCloseDialog();
      fetchBabysitters();
    } catch (error) {
      console.error('Error saving babysitter:', error);
      showSnackbar('Failed to save babysitter', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this babysitter?')) {
      try {
        await mockApi.deleteBabysitter(id);
        showSnackbar('Babysitter deleted successfully', 'success');
        fetchBabysitters();
      } catch (error) {
        console.error('Error deleting babysitter:', error);
        showSnackbar('Failed to delete babysitter', 'error');
      }
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
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Babysitters
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Babysitter
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {babysitters.map((babysitter) => (
              <TableRow key={babysitter.id}>
                <TableCell>{`${babysitter.firstName} ${babysitter.lastName}`}</TableCell>
                <TableCell>{babysitter.email}</TableCell>
                <TableCell>{babysitter.phoneNumber}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: babysitter.status === 'active' ? 'success.main' : 'error.main',
                      textTransform: 'capitalize'
                    }}
                  >
                    {babysitter.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(babysitter)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(babysitter.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentBabysitter ? 'Edit Babysitter' : 'Add New Babysitter'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Box>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="emergencyContact"
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="availability"
                label="Availability"
                value={formData.availability}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="qualifications"
                label="Qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentBabysitter ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Babysitters; 