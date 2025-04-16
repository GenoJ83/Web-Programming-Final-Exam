import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const role = localStorage.getItem("userRole");

// const getDashboardPath = (role) => {
//   switch (role) {
//     case 'parent':
//       return '/dashboard/parent';
//     case 'manager':
//       return '/dashboard/staff';
//     case 'babysitter':
//       return '/dashboard/staff';
//     case 'admin':
//       return '/dashboard/admin';
//     default:
//       return '/profile'; // fallback
//   }
// };

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [role, setRole] = useState(localStorage.getItem("userRole")); // Properly define role state

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // logout();
    navigate('/');
  };

  // // Ensure user is redirected to the correct dashboard on load
  // useEffect(() => {
  //   if (role) {
  //     const dashboardPath = getDashboardPath(role);
  //     if (location.pathname === '/') {
  //       navigate(dashboardPath);
  //     }
  //   }
  // }, [role, navigate, location]);

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("userRole"));
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on location changes in case it was updated in the same tab
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getDashboardPath = (currentRole) => {
    switch (currentRole) {
      case 'parent':
        return '/dashboard/parent';
      case 'manager':
        return '/dashboard/staff';
      case 'babysitter':
        return '/dashboard/staff';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/profile';
    }
  };

  useEffect(() => {
    if (role) {
      const dashboardPath = getDashboardPath(role);
      if (location.pathname === '/') {
        navigate(dashboardPath);
      }
    }
  }, [role, navigate, location]);


  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: getDashboardPath(role) },
    { text: 'Children', icon: <ChildCareIcon />, path: '/children' },
    { text: 'Babysitters', icon: <PeopleIcon />, path: '/babysitters' },
    { text: 'Attendance', icon: <AccessTimeIcon />, path: '/attendance' },
    { text: 'Scheduling', icon: <ScheduleIcon />, path: '/schedules' },
    { text: 'Incidents', icon: <ReportIcon />, path: '/incidents' },
    { text: 'Finances', icon: <AttachMoneyIcon />, path: '/finances' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Daystar Daycare
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
