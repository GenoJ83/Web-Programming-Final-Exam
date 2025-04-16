import React, { useState, useEffect, useCallback } from 'react';
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
  Notifications as NotificationIcon,
  Edit as EditIcon,
  ChildCare as ChildIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import mockApi from '../utils/mockData';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedChildren, setAssignedChildren] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch assigned children
      const childrenData = await mockApi.getChildren();
      setAssignedChildren(childrenData);
      
      // Fetch upcoming events
      const eventsData = await mockApi.getEvents();
      const upcoming = eventsData
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setUpcomingEvents(upcoming);
      
      // Fetch notifications
      const notificationsData = await mockApi.getNotifications();
      setNotifications(notificationsData);
      
      // Fetch schedule
      const scheduleData = await mockApi.getSchedule();
      setSchedule(scheduleData);
      
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewChildren = () => {
    navigate('/children');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewSchedule = () => {
    navigate('/schedule');
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
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, Staff Member!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Staff Member at Daystar Daycare
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
                  <Typography variant="h4">{assignedChildren.length}</Typography>
                  <Typography color="textSecondary">Assigned Children</Typography>
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
                  <Typography variant="h4">{upcomingEvents.length}</Typography>
                  <Typography color="textSecondary">Upcoming Events</Typography>
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
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{schedule.length}</Typography>
                  <Typography color="textSecondary">Scheduled Hours</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Assigned Children Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Assigned Children
              </Typography>
              <Button
                variant="text"
                startIcon={<PeopleIcon />}
                onClick={handleViewChildren}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {assignedChildren.length > 0 ? (
              <List>
                {assignedChildren.map((child) => (
                  <React.Fragment key={child.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={child.profileImage}>
                          {child.firstName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${child.firstName} ${child.lastName}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Age: {child.age} years
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Parent: {child.parentName}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={child.class}
                        color="primary"
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No children assigned.
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

        {/* Schedule Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Your Schedule
              </Typography>
              <Button
                variant="text"
                startIcon={<ScheduleIcon />}
                onClick={handleViewSchedule}
              >
                View Full Schedule
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {schedule.length > 0 ? (
              <List>
                {schedule.map((shift) => (
                  <React.Fragment key={shift.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ScheduleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${new Date(shift.date).toLocaleDateString()}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {shift.startTime} - {shift.endTime}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {shift.role}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={shift.status}
                        color={shift.status === 'confirmed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No schedule available.
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

export default StaffDashboard;
