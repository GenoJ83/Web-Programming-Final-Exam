import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Notifications() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Notifications functionality will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Notifications; 