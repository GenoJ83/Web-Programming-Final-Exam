import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Dashboard from './components/Dashboard';
import FinancialReport from './components/FinancialReport';
import SchedulingForm from './components/SchedulingForm';

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
import BabysitterRegistration from './pages/authStaffDashboard'
import Attendance from './pages/Attendance';
import IncidentManagement from './pages/IncidentManagement';
import Scheduling from './pages/Scheduling';

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

          {/* Protected Routes with Sidebar Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/parent" element={<Dashboard />} />
            <Route path="dashboard/staff" element={<Dashboard />} />
            <Route path="dashboard/admin" element={<Dashboard />} />

            <Route path="babysitters" element={<Babysitters />} />
            <Route path="children" element={<Children />} />
            <Route path="finances" element={<Finances />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/register-babysitter" element={<BabysitterRegistration />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="scheduling" element={<Scheduling />} />
          </Route>

          {/* Non-sidebar routes (can be moved into layout if needed) */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/financial-report" element={<FinancialReport />} />
          <Route path="/schedule" element={<SchedulingForm />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
