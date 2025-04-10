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
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Notifications as NotificationIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  ChildCare as ChildIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import mockApi from '../utils/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalParents: 0,
    totalStaff: 0,
    totalEvents: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics
        const childrenData = await mockApi.getChildren();
        const parentsData = await mockApi.getUsersByRole('parent');
        const staffData = await mockApi.getUsersByRole('staff');
        const eventsData = await mockApi.getEvents();
        const paymentsData = await mockApi.getPayments();
        
        setStats({
          totalChildren: childrenData.length,
          totalParents: parentsData.length,
          totalStaff: staffData.length,
          totalEvents: eventsData.length,
          pendingPayments: paymentsData.filter(p => p.status === 'pending').length,
          totalRevenue: paymentsData
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0),
        });
        
        // Fetch recent registrations
        const recentUsers = [...parentsData, ...staffData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentRegistrations(recentUsers);
        
        // Fetch upcoming events
        const upcomingEvents = eventsData
          .filter(e => new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        setUpcomingEvents(upcomingEvents);
        
        // Fetch pending payments
        const pending = paymentsData
          .filter(p => p.status === 'pending')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        setPendingPayments(pending);
        
        // Fetch notifications
        const notificationsData = await mockApi.getNotificationsByUser(user.id);
        setNotifications(notificationsData);
        
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
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

  const handleViewUsers = () => {
    navigate('/users');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewPayments = () => {
    navigate('/payments');
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
            {user?.bio || 'Administrator at Daystar Daycare'}
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ChildIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalChildren}</Typography>
                  <Typography color="textSecondary">Total Children</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalParents}</Typography>
                  <Typography color="textSecondary">Total Parents</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalStaff}</Typography>
                  <Typography color="textSecondary">Total Staff</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.totalEvents}</Typography>
                  <Typography color="textSecondary">Total Events</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PaymentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.pendingPayments}</Typography>
                  <Typography color="textSecondary">Pending Payments</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
                  <Typography color="textSecondary">Total Revenue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Registrations Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Recent Registrations
              </Typography>
              <Button
                variant="text"
                startIcon={<PeopleIcon />}
                onClick={handleViewUsers}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recentRegistrations.length > 0 ? (
              <List>
                {recentRegistrations.map((registration) => (
                  <React.Fragment key={registration.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={registration.profileImage}>
                          {registration.firstName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${registration.firstName} ${registration.lastName}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {registration.role.charAt(0).toUpperCase() + registration.role.slice(1)}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Registered: {new Date(registration.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={registration.role}
                        color={registration.role === 'staff' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No recent registrations.
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
            
            {upcomingEvents.length > 0 ? (
              <List>
                {upcomingEvents.map((event) => (
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

        {/* Pending Payments Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Pending Payments
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
            
            {pendingPayments.length > 0 ? (
              <List>
                {pendingPayments.map((payment) => (
                  <React.Fragment key={payment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PaymentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`$${payment.amount.toFixed(2)} - ${payment.description}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Due: {new Date(payment.date).toLocaleDateString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Parent: {payment.parentName}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label="Pending"
                        color="warning"
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No pending payments.
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
                {notifications.slice(0, 5).map((notification) => (
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

export default AdminDashboard; 