import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Babysitters from './pages/Babysitters';
import Children from './pages/Children';
import Finances from './pages/Finances';
import Notifications from './pages/Notifications';
import UserManagement from './pages/UserManagement';
import ParentDashboard from './pages/ParentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Enrollment from './pages/Enrollment';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes (you can add auth checks later) */}
          <Route path="/dashboard/parent" element={<Layout><ParentDashboard /></Layout>} />
          <Route path="/dashboard/staff" element={<Layout><StaffDashboard /></Layout>} />
          <Route path="/dashboard/admin" element={<Layout><AdminDashboard /></Layout>} />

          <Route path="/babysitters" element={<Layout><Babysitters /></Layout>} />
          <Route path="/children" element={<Layout><Children /></Layout>} />
          <Route path="/finances" element={<Layout><Finances /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
