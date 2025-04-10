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
  IconButton,
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
import { useAuth } from '../contexts/AuthContext';
import mockApi from '../utils/mockData';

function Dashboard() {
  const { user } = useAuth();
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
        // Fetch children data
        const childrenData = await mockApi.getChildren();
        setChildren(childrenData);
        
        // Fetch upcoming events
        const eventsData = await mockApi.getEvents();
        setUpcomingEvents(eventsData);
        
        // Fetch notifications
        const notificationsData = await mockApi.getNotifications();
        setNotifications(notificationsData);
        
        // Fetch payment history
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
          Welcome, {user?.firstName || 'Parent'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your children today.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Children
              </Typography>
              <Typography variant="h3" component="div">
                {children.length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                sx={{ color: 'white' }}
                onClick={() => handleViewAll('/children')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Upcoming Events
              </Typography>
              <Typography variant="h3" component="div">
                {upcomingEvents.length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                sx={{ color: 'white' }}
                onClick={() => handleViewAll('/events')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Notifications
              </Typography>
              <Typography variant="h3" component="div">
                {notifications.filter(n => !n.read).length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                sx={{ color: 'white' }}
                onClick={() => handleViewAll('/notifications')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Pending Payments
              </Typography>
              <Typography variant="h3" component="div">
                {payments.filter(p => p.status === 'pending').length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                sx={{ color: 'white' }}
                onClick={() => handleViewAll('/finances')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Children" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Events" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Payments" icon={<PaymentIcon />} iconPosition="start" />
        </Tabs>

        {/* Children Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Your Children</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleViewAll('/children')}
              >
                View All
              </Button>
            </Box>
            {children.length > 0 ? (
              <Grid container spacing={2}>
                {children.map((child) => (
                  <Grid item xs={12} sm={6} md={4} key={child.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 56, 
                              height: 56, 
                              mr: 2,
                              bgcolor: theme.palette.primary.main
                            }}
                          >
                            {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {child.firstName} {child.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Age: {child.age} • {child.class}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Teacher" 
                              secondary={child.teacher || 'Not assigned'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CalendarIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Attendance" 
                              secondary={child.attendance || 'Not available'} 
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate(`/children/${child.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No children registered yet
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/children')}
                >
                  Register a Child
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Upcoming Events</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleViewAll('/events')}
              >
                View All
              </Button>
            </Box>
            {upcomingEvents.length > 0 ? (
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem 
                    key={event.id}
                    sx={{ 
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </Typography>
                          <Typography variant="body2" component="div">
                            {event.description}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color={
                        event.type === 'Holiday' ? 'error' : 
                        event.type === 'Activity' ? 'success' : 
                        event.type === 'Meeting' ? 'info' : 'default'
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No upcoming events
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Notifications Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Notifications</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleViewAll('/notifications')}
              >
                View All
              </Button>
            </Box>
            {notifications.length > 0 ? (
              <List>
                {notifications.slice(0, 5).map((notification) => (
                  <ListItem 
                    key={notification.id}
                    sx={{ 
                      bgcolor: notification.read ? 'background.paper' : 'action.hover',
                      mb: 1,
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon color={notification.read ? "disabled" : "primary"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {new Date(notification.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" component="div">
                            {notification.message}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    {!notification.read && (
                      <Chip label="New" size="small" color="primary" />
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Payments Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Payments</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleViewAll('/finances')}
              >
                View All
              </Button>
            </Box>
            {payments.length > 0 ? (
              <List>
                {payments.slice(0, 5).map((payment) => (
                  <ListItem 
                    key={payment.id}
                    sx={{ 
                      borderLeft: `4px solid ${
                        payment.status === 'paid' ? theme.palette.success.main : 
                        payment.status === 'pending' ? theme.palette.warning.main : 
                        theme.palette.error.main
                      }`,
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      <PaymentIcon color={
                        payment.status === 'paid' ? "success" : 
                        payment.status === 'pending' ? "warning" : 
                        "error"
                      } />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Payment for ${payment.description}`}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {new Date(payment.date).toLocaleDateString()} • ${payment.amount.toFixed(2)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <Chip 
                      label={payment.status} 
                      size="small" 
                      color={
                        payment.status === 'paid' ? 'success' : 
                        payment.status === 'pending' ? 'warning' : 
                        'error'
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PaymentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No payment history
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <MessageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1">Contact Teacher</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small">Send Message</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <CalendarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1">Schedule Pickup</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small">Schedule</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1">View Reports</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small">View</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <PaymentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1">Make Payment</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small">Pay Now</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 