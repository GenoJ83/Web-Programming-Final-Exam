import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const FinancialReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/schedules/payments/summary');
      setReportData(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('financial-report.pdf');
    } catch (error) {
      setError('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={exportToPDF}
        >
          Export to PDF
        </Button>
      </Box>

      <Paper ref={reportRef} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Financial Report
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          {new Date().toLocaleDateString()}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Payments</Typography>
              <Typography variant="h4" color="primary">
                {reportData?.totalPayments || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h4" color="primary">
                ${reportData?.totalAmount?.toLocaleString() || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Paid Amount</Typography>
              <Typography variant="h4" color="success.main">
                ${reportData?.paidAmount?.toLocaleString() || 0}
              </Typography>
            </Paper>
          </Grid>

          {/* Payment Status Breakdown */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Payment Status Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Pending</TableCell>
                    <TableCell align="right">
                      {reportData?.pendingCount || 0}
                    </TableCell>
                    <TableCell align="right">
                      ${reportData?.pendingAmount?.toLocaleString() || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Paid</TableCell>
                    <TableCell align="right">
                      {reportData?.paidCount || 0}
                    </TableCell>
                    <TableCell align="right">
                      ${reportData?.paidAmount?.toLocaleString() || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cancelled</TableCell>
                    <TableCell align="right">
                      {reportData?.cancelledCount || 0}
                    </TableCell>
                    <TableCell align="right">
                      ${reportData?.cancelledAmount?.toLocaleString() || 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Child</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.recentTransactions?.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {transaction.childFirstName} {transaction.childLastName}
                      </TableCell>
                      <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FinancialReport; 