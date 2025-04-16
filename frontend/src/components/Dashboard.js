import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChildCare as ChildCareIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Schedule as ScheduleIcon,
  Report as ReportIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');

  const features = [
    {
      title: 'Children',
      description: 'Manage children records and information',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      path: '/children',
      roles: ['admin', 'manager', 'babysitter', 'parent']
    },
    {
      title: 'Babysitters',
      description: 'Manage babysitter profiles and schedules',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/babysitters',
      roles: ['admin', 'manager']
    },
    {
      title: 'Attendance',
      description: 'Track daily attendance and check-ins',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      path: '/attendance',
      roles: ['admin', 'manager', 'babysitter']
    },
    {
      title: 'Scheduling',
      description: 'Manage schedules and sessions',
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      path: '/schedules',
      roles: ['admin', 'manager', 'parent']
    },
    {
      title: 'Incidents',
      description: 'Report and track incidents',
      icon: <ReportIcon sx={{ fontSize: 40 }} />,
      path: '/incidents',
      roles: ['admin', 'manager', 'babysitter']
    },
    {
      title: 'Finances',
      description: 'Manage payments and financial records',
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      path: '/finances',
      roles: ['admin', 'manager', 'parent']
    },
    {
      title: 'Notifications',
      description: 'View and manage notifications',
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      path: '/notifications',
      roles: ['admin', 'manager', 'babysitter', 'parent']
    }
  ];

  const filteredFeatures = features.filter(feature => 
    feature.roles.includes(role)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Daystar Daycare
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quick access to all features
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredFeatures.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <Box sx={{ mb: 2, color: 'primary.main' }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {feature.description}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(feature.path)}
                fullWidth
              >
                Access
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 