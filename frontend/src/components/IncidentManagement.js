import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const IncidentManagement = () => {
  const [formData, setFormData] = useState({
    childId: '',
    babysitterId: '',
    description: '',
    severity: '',
    actionTaken: '',
    date: new Date()
  });

  const [incidents, setIncidents] = useState([]);
  const [children, setChildren] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    fetchIncidents();
    fetchChildren();
    fetchBabysitters();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/incidents');
      setIncidents(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching incidents',
        severity: 'error'
      });
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/children');
      setChildren(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching children',
        severity: 'error'
      });
    }
  };

  const fetchBabysitters = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/babysitters');
      setBabysitters(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching babysitters',
        severity: 'error'
      });
    }
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
      date
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.childId) newErrors.childId = 'Child is required';
    if (!formData.babysitterId) newErrors.babysitterId = 'Babysitter is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.severity) newErrors.severity = 'Severity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('http://localhost:4400/api/incidents', formData);
      setSnackbar({
        open: true,
        message: 'Incident reported successfully',
        severity: 'success'
      });
      fetchIncidents();
      setFormData({
        childId: '',
        babysitterId: '',
        description: '',
        severity: '',
        actionTaken: '',
        date: new Date()
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error reporting incident',
        severity: 'error'
      });
    }
  };

  const handleUpdateStatus = async (incidentId, status, actionTaken) => {
    try {
      await axios.put(`http://localhost:4400/api/incidents/${incidentId}/status`, {
        status,
        actionTaken
      });
      setSnackbar({
        open: true,
        message: 'Incident status updated successfully',
        severity: 'success'
      });
      fetchIncidents();
      setUpdateDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating incident status',
        severity: 'error'
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Incident Management
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.childId}>
                <InputLabel>Child</InputLabel>
                <Select
                  name="childId"
                  value={formData.childId}
                  onChange={handleChange}
                  label="Child"
                >
                  {children.map((child) => (
                    <MenuItem key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.childId && <FormHelperText>{errors.childId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.babysitterId}>
                <InputLabel>Babysitter</InputLabel>
                <Select
                  name="babysitterId"
                  value={formData.babysitterId}
                  onChange={handleChange}
                  label="Babysitter"
                >
                  {babysitters.map((babysitter) => (
                    <MenuItem key={babysitter.id} value={babysitter.id}>
                      {babysitter.firstName} {babysitter.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.babysitterId && <FormHelperText>{errors.babysitterId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.severity}>
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  label="Severity"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                {errors.severity && <FormHelperText>{errors.severity}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date and Time"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Action Taken"
                name="actionTaken"
                multiline
                rows={2}
                value={formData.actionTaken}
                onChange={handleChange}
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
                Report Incident
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Incidents
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Child</TableCell>
                  <TableCell>Babysitter</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      {incident.childFirstName} {incident.childLastName}
                    </TableCell>
                    <TableCell>
                      {incident.babysitterFirstName} {incident.babysitterLastName}
                    </TableCell>
                    <TableCell>{incident.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={incident.severity}
                        color={getSeverityColor(incident.severity)}
                      />
                    </TableCell>
                    <TableCell>{new Date(incident.date).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={incident.status}
                        color={incident.status === 'open' ? 'warning' : 'success'}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedIncident(incident);
                          setUpdateDialogOpen(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Update Incident Status</DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedIncident.status}
                  onChange={(e) => setSelectedIncident({
                    ...selectedIncident,
                    status: e.target.value
                  })}
                  label="Status"
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Action Taken"
                multiline
                rows={3}
                value={selectedIncident.actionTaken || ''}
                onChange={(e) => setSelectedIncident({
                  ...selectedIncident,
                  actionTaken: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleUpdateStatus(
              selectedIncident.id,
              selectedIncident.status,
              selectedIncident.actionTaken
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

export default IncidentManagement; 