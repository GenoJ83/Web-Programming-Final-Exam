import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Event as EventIcon,
  Payment as PaymentIcon,
  ChildCare as ChildIcon,
  Notifications as NotificationIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import mockApi from '../utils/mockData';

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [children, setChildren] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch children data
        const childrenData = await mockApi.getChildrenByParent(user.id);
        setChildren(childrenData);
        
        // Fetch upcoming events
        const eventsData = await mockApi.getEvents();
        setEvents(eventsData);
        
        // Fetch payments
        const paymentsData = await mockApi.getPaymentsByParent(user.id);
        setPayments(paymentsData);
        
        // Fetch notifications
        const notificationsData = await mockApi.getNotificationsByUser(user.id);
        setNotifications(notificationsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewChildren = () => {
    navigate('/children');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewPayments = () => {
    navigate('/payments');
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Welcome Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={user?.profileImage}
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.firstName} {user?.lastName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.bio || 'Parent at Daystar Daycare'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleViewProfile}
            sx={{ mt: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Children Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Your Children
              </Typography>
              <Button
                variant="text"
                startIcon={<ChildIcon />}
                onClick={handleViewChildren}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {children.length > 0 ? (
              <List>
                {children.map((child) => (
                  <React.Fragment key={child.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{child.firstName.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${child.firstName} ${child.lastName}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Age: {new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()} years
                            </Typography>
                            <br />
                            {child.medicalInfo && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                Medical Info: {child.medicalInfo}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No children registered yet.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Events Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Upcoming Events
              </Typography>
              <Button
                variant="text"
                startIcon={<EventIcon />}
                onClick={handleViewEvents}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {events.length > 0 ? (
              <List>
                {events.slice(0, 3).map((event) => (
                  <React.Fragment key={event.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No upcoming events.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Payments Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Recent Payments
              </Typography>
              <Button
                variant="text"
                startIcon={<PaymentIcon />}
                onClick={handleViewPayments}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {payments.length > 0 ? (
              <List>
                {payments.slice(0, 3).map((payment) => (
                  <React.Fragment key={payment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PaymentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`$${payment.amount} - ${payment.description}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(payment.date).toLocaleDateString()}
                            </Typography>
                            <br />
                            <Chip
                              label={payment.status}
                              color={getPaymentStatusColor(payment.status)}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No recent payments.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Notifications Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Notifications
              </Typography>
              <Button
                variant="text"
                startIcon={<NotificationIcon />}
                onClick={() => navigate('/notifications')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {notifications.length > 0 ? (
              <List>
                {notifications.slice(0, 3).map((notification) => (
                  <React.Fragment key={notification.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <NotificationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No notifications.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ParentDashboard; 