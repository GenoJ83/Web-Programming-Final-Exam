# Daystar Daycare Frontend

This is the frontend application for the Daystar Daycare Management System.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```
   npm start
   ```

4. For production build:
   ```
   npm run build
   ```

## Features

- User authentication (login, register, logout)
- Role-based access control (admin, staff, parent)
- Dashboard for each user role
- Child management
- Event management
- Payment tracking
- Notifications

## Project Structure

- `src/components` - Reusable UI components
- `src/contexts` - React context providers
- `src/pages` - Page components
- `src/utils` - Utility functions and API services
- `src/theme.js` - Material-UI theme configuration

## Connecting to Backend

The frontend connects to the backend API using the `api.js` service. Make sure the backend server is running and the `REACT_APP_API_URL` environment variable is set correctly.
