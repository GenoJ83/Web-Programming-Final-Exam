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
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
// import mockApi from '../utils/mockData';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4400',
  headers: {
    'Content-Type': 'application/json'
  }
});


function Finances() {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFinance, setCurrentFinance] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: 'completed'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchFinances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/finances');
      setFinances(response.data);
      calculateSummary(response.data);
    } catch (error) {
      console.error('Error fetching finances:', error);
      showSnackbar('Failed to fetch finances', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  const calculateSummary = (data) => {
    const summary = data.reduce((acc, curr) => {
      const amount = parseFloat(curr.amount) || 0;
    
      if (curr.type === 'income') {
        acc.totalIncome += amount;
      } else {
        acc.totalExpenses += amount;
      }
    
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });
    

    summary.balance = summary.totalIncome - summary.totalExpenses;
    setSummary(summary);
  };

  const handleOpenDialog = (finance = null) => {
    if (finance) {
      setCurrentFinance(finance);
      setFormData({
        type: finance.type,
        amount: finance.amount,
        description: finance.description,
        date: new Date(finance.date).toISOString().split('T')[0],
        category: finance.category,
        status: finance.status
      });
    } else {
      setCurrentFinance(null);
      setFormData({
        type: 'income',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        status: 'completed'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentFinance(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        date: formData.date
      };
  
      if (currentFinance) {
        await api.put(`/finances/${currentFinance.id}`, submissionData);
        showSnackbar('Finance record updated successfully', 'success');
      } else {
        await api.post('/finances', submissionData);
        showSnackbar('Finance record added successfully', 'success');
      }
      handleCloseDialog();
      fetchFinances();
    } catch (error) {
      console.error('Error saving finance record:', error);
      showSnackbar('Failed to save finance record', 'error');
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this finance record?')) {
      try {
        await api.delete(`/finances/${id}`);
        showSnackbar('Finance record deleted successfully', 'success');
        fetchFinances();
      } catch (error) {
        console.error('Error deleting finance record:', error);
        showSnackbar('Failed to delete finance record', 'error');
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
          Finances
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Income
              </Typography>
              <Typography variant="h4" color="success.main">
                UGX {summary.totalIncome.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Expenses
              </Typography>
              <Typography variant="h4" color="error.main">
                UGX {summary.totalExpenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Balance
              </Typography>
              <Typography variant="h4" color={summary.balance >= 0 ? 'success.main' : 'error.main'}>
                UGX {summary.balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finances.map((finance) => (
              <TableRow key={finance.id}>
                <TableCell>{new Date(finance.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: finance.type === 'income' ? 'success.main' : 'error.main',
                      textTransform: 'capitalize'
                    }}
                  >
                    {finance.type}
                  </Typography>
                </TableCell>
                <TableCell>{finance.category}</TableCell>
                <TableCell>{finance.description}</TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      color: finance.type === 'income' ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {Number(finance.amount).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>{finance.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(finance)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(finance.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentFinance ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="type"
                  label="Transaction Type"
                  value={formData.type}
                  onChange={handleChange}
                  select
                  required
                  fullWidth
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ min: 0, step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  select
                  required
                  fullWidth
                >
                  <MenuItem value="tuition">Tuition</MenuItem>
                  <MenuItem value="supplies">Supplies</MenuItem>
                  <MenuItem value="salary">Salary</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="date"
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  select
                  required
                  fullWidth
                >
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentFinance ? 'Update' : 'Add'}
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

export default Finances;