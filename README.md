# Daystar Daycare Management System

A comprehensive management system for Daystar Daycare Center, handling babysitter management, child management, financial operations, and automated notifications.

## Features

- **User Management**
  - Role-based authentication (Manager, Babysitter)
  - Secure login and registration
  - Profile management

- **Babysitter Management**
  - Babysitter registration and profiles
  - Attendance tracking
  - Payment management
  - Performance monitoring

- **Child Management**
  - Child registration and profiles
  - Attendance tracking
  - Incident reporting
  - Parent communication

- **Financial Management**
  - Payment processing
  - Expense tracking
  - Budget management
  - Financial reporting
  - Automated payment reminders

- **Notifications**
  - Payment reminders
  - Overdue payment alerts
  - Budget threshold notifications
  - Daily financial summaries

## Tech Stack

- **Backend**
  - Node.js
  - Express.js
  - Sequelize ORM
  - MySQL Database
  - JWT Authentication

- **Development Tools**
  - ESLint
  - Prettier
  - Jest
  - Nodemon

## Prerequisites

- Node.js >= 14.0.0
- MySQL >= 5.7
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/daystar-daycare.git
   cd daystar-daycare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=daystar_daycare

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h

   # Email Configuration
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password

   # Payment Configuration
   HALF_DAY_RATE=2000
   FULL_DAY_RATE=5000
   ```

4. Create the database:
   ```sql
   CREATE DATABASE daystar_daycare;
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Lint code:
   ```bash
   npm run lint
   ```

5. Format code:
   ```bash
   npm run format
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PATCH /api/auth/profile` - Update user profile

### Babysitters
- `GET /api/babysitters` - Get all babysitters
- `POST /api/babysitters` - Register new babysitter
- `GET /api/babysitters/:id` - Get babysitter by ID
- `PATCH /api/babysitters/:id` - Update babysitter
- `DELETE /api/babysitters/:id` - Delete babysitter
- `GET /api/babysitters/:id/payments` - Get babysitter's payments
- `GET /api/babysitters/:id/attendance` - Get babysitter's attendance

### Children
- `GET /api/children` - Get all children
- `POST /api/children` - Register new child
- `GET /api/children/:id` - Get child by ID
- `PATCH /api/children/:id` - Update child
- `DELETE /api/children/:id` - Delete child
- `POST /api/children/:id/attendance` - Record child attendance
- `PATCH /api/children/:id/attendance/:attendanceId` - Record child check-out
- `POST /api/children/:id/incidents` - Report incident for child

### Finance
- `POST /api/finance/payments` - Record new payment
- `GET /api/finance/payments` - Get all payments
- `POST /api/finance/expenses` - Record new expense
- `GET /api/finance/expenses` - Get all expenses
- `POST /api/finance/budgets` - Create new budget
- `GET /api/finance/budgets` - Get all budgets
- `GET /api/finance/summary` - Get financial summary

### Notifications
- `POST /api/notifications/payment-reminder/:childId` - Send payment reminder
- `POST /api/notifications/overdue-payment/:childId` - Send overdue payment notice
- `POST /api/notifications/budget-alert/:budgetId` - Send budget threshold alert
- `POST /api/notifications/daily-summary` - Send daily financial summary

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
