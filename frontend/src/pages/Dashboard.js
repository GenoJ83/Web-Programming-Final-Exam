import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Message as MessageIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import mockApi from '../utils/mockData';

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [children, setChildren] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const childrenData = await mockApi.getChildren();
        setChildren(childrenData);

        const eventsData = await mockApi.getEvents();
        setUpcomingEvents(eventsData);

        const notificationsData = await mockApi.getNotifications();
        setNotifications(notificationsData);

        const paymentsData = await mockApi.getPayments();
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewAll = (path) => {
    navigate(path);
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
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome, Parent!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your children today.
        </Typography>
      </Box>
            {/* Tabs for switching between children */}
            <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          aria-label="children tabs"
        >
          {children.map((child, index) => (
            <Tab
              key={child.id}
              label={
                <Box display="flex" alignItems="center">
                  <Avatar src={child.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  {child.name}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Child Info and Quick Stats */}
      {children.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Child Info
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary={children[activeTab].name} secondary="Name" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText primary={children[activeTab].className} secondary="Class" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarIcon /></ListItemIcon>
                    <ListItemText primary={children[activeTab].dob} secondary="Date of Birth" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>Upcoming Events</Typography>
                    <Typography variant="h4">{upcomingEvents.length}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleViewAll('/events')}>
                      View All <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>Outstanding Payments</Typography>
                    <Typography variant="h4">{payments.length}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleViewAll('/payments')}>
                      View All <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Notifications and Messages */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <List>
                {notifications.slice(0, 5).map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemIcon><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary={notification.title} secondary={notification.date} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleViewAll('/notifications')}>
                View All <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <List>
                {children[activeTab]?.messages?.slice(0, 5).map((msg) => (
                  <ListItem key={msg.id}>
                    <ListItemIcon><MessageIcon /></ListItemIcon>
                    <ListItemText primary={msg.content} secondary={msg.date} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleViewAll('/messages')}>
                View All <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

