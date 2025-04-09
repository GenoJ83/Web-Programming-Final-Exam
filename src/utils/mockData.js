// Mock data for the application
let mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'manager',
    phoneNumber: '123-456-7890',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'babysitter',
    phoneNumber: '987-654-3210',
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'parent',
    phoneNumber: '555-123-4567',
    createdAt: new Date('2023-01-10')
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Williams',
    email: 'david@example.com',
    password: 'password123',
    role: 'parent',
    phoneNumber: '555-234-5678',
    createdAt: new Date('2023-02-01')
  }
];

const mockBabysitters = [
  {
    id: '1',
    userId: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phoneNumber: '987-654-3210',
    address: '123 Main St, Anytown, USA',
    emergencyContact: 'John Smith (555-123-4567)',
    availability: 'Monday-Friday, 8am-5pm',
    qualifications: 'CPR Certified, Early Childhood Education',
    status: 'active',
    createdAt: new Date('2023-01-02')
  }
];

const mockChildren = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: new Date('2018-05-15'),
    gender: 'female',
    parentId: '3', // Link to parent user
    parentName: 'Sarah Johnson',
    parentPhone: '555-123-4567',
    parentEmail: 'sarah@example.com',
    address: '456 Oak St, Anytown, USA',
    emergencyContact: 'Michael Johnson (555-987-6543)',
    medicalInfo: 'No allergies',
    enrollmentDate: new Date('2023-01-10'),
    status: 'active',
    createdAt: new Date('2023-01-10')
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Williams',
    dateOfBirth: new Date('2019-03-20'),
    gender: 'male',
    parentId: '4', // Link to parent user
    parentName: 'David Williams',
    parentPhone: '555-234-5678',
    parentEmail: 'david@example.com',
    address: '789 Pine St, Anytown, USA',
    emergencyContact: 'Lisa Williams (555-876-5432)',
    medicalInfo: 'Allergic to peanuts',
    enrollmentDate: new Date('2023-02-01'),
    status: 'active',
    createdAt: new Date('2023-02-01')
  }
];

const mockFinances = [
  {
    id: '1',
    type: 'income',
    amount: 1200,
    description: 'Monthly tuition - Emma Johnson',
    date: new Date('2023-03-01'),
    category: 'tuition',
    status: 'completed',
    createdAt: new Date('2023-03-01')
  },
  {
    id: '2',
    type: 'expense',
    amount: 500,
    description: 'Supplies for March',
    date: new Date('2023-03-05'),
    category: 'supplies',
    status: 'completed',
    createdAt: new Date('2023-03-05')
  },
  {
    id: '3',
    type: 'income',
    amount: 1200,
    description: 'Monthly tuition - Liam Williams',
    date: new Date('2023-03-01'),
    category: 'tuition',
    status: 'completed',
    createdAt: new Date('2023-03-01')
  }
];

const mockNotifications = [
  {
    id: '1',
    userId: '1', // Admin user
    title: 'New Enrollment',
    message: 'Liam Williams has been enrolled in the daycare.',
    type: 'info',
    read: false,
    createdAt: new Date('2023-02-01')
  },
  {
    id: '2',
    userId: '1', // Admin user
    title: 'Payment Received',
    message: 'Payment of $1200 received from Sarah Johnson.',
    type: 'success',
    read: true,
    createdAt: new Date('2023-03-01')
  },
  {
    id: '3',
    userId: '1', // Admin user
    title: 'Upcoming Event',
    message: 'Spring Break is coming up next week.',
    type: 'warning',
    read: false,
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    userId: '2', // Staff user
    title: 'Schedule Update',
    message: 'Your schedule has been updated for next week.',
    type: 'info',
    read: false,
    createdAt: new Date('2023-03-15')
  },
  {
    id: '5',
    userId: '2', // Staff user
    title: 'New Assignment',
    message: 'You have been assigned to a new child.',
    type: 'info',
    read: true,
    createdAt: new Date('2023-03-20')
  }
];

const mockEvents = [
  {
    id: '1',
    title: 'Spring Break',
    description: 'Daycare will be closed for spring break.',
    date: new Date('2023-04-10'),
    time: 'All Day',
    type: 'Holiday',
    createdAt: new Date('2023-03-10')
  },
  {
    id: '2',
    title: 'Parent-Teacher Conference',
    description: 'Annual parent-teacher conference to discuss your child\'s progress.',
    date: new Date('2023-04-15'),
    time: '3:00 PM - 7:00 PM',
    type: 'Meeting',
    createdAt: new Date('2023-03-15')
  },
  {
    id: '3',
    title: 'Field Trip to Zoo',
    description: 'Fun day at the zoo for all children. Permission slips required.',
    date: new Date('2023-04-20'),
    time: '9:00 AM - 2:00 PM',
    type: 'Activity',
    createdAt: new Date('2023-03-20')
  }
];

const mockPayments = [
  {
    id: '1',
    amount: 1200,
    description: 'Monthly tuition - Emma Johnson',
    date: new Date('2023-03-01'),
    status: 'paid',
    parentId: '3', // Link to parent user
    createdAt: new Date('2023-03-01')
  },
  {
    id: '2',
    amount: 1200,
    description: 'Monthly tuition - Liam Williams',
    date: new Date('2023-03-01'),
    status: 'pending',
    parentId: '4', // Link to parent user
    createdAt: new Date('2023-03-01')
  },
  {
    id: '3',
    amount: 500,
    description: 'After-school program - Emma Johnson',
    date: new Date('2023-03-15'),
    status: 'overdue',
    parentId: '3', // Link to parent user
    createdAt: new Date('2023-03-15')
  }
];

const mockSchedule = [
  {
    id: '1',
    staffId: '2',
    date: new Date('2023-04-01'),
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    type: 'regular',
    status: 'confirmed'
  },
  {
    id: '2',
    staffId: '2',
    date: new Date('2023-04-02'),
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    type: 'regular',
    status: 'confirmed'
  }
];

// Mock API functions
const mockApi = {
  // Auth functions
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Login attempt:', { email, password });
        console.log('Available users:', mockUsers);
        
        const user = mockUsers.find(u => {
          console.log('Checking user:', u.email, u.password);
          return u.email === email && u.password === password;
        });
        
        if (user) {
          console.log('User found:', user);
          const { password, ...userWithoutPassword } = user;
          const token = btoa(JSON.stringify({
            sub: user.id,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
          }));
          
          // Ensure we're returning the complete user object with role
          const userData = {
            ...userWithoutPassword,
            role: user.role
          };
          
          console.log('Mock API login - User data:', userData);
          
          resolve({
            token,
            user: userData
          });
        } else {
          console.log('No user found with these credentials');
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },

  refreshToken: (oldToken) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tokenData = JSON.parse(atob(oldToken.split('.')[1]));
          const user = mockUsers.find(u => u.id === tokenData.sub);
          if (user) {
            const { password, ...userWithoutPassword } = user;
            const newToken = btoa(JSON.stringify({
              sub: user.id,
              exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
            }));
            resolve({
              token: newToken,
              user: userWithoutPassword
            });
          } else {
            reject(new Error('User not found'));
          }
        } catch (error) {
          reject(new Error('Invalid token'));
        }
      }, 500);
    });
  },

  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          reject(new Error('Email already registered'));
          return;
        }

        const newUser = {
          id: String(mockUsers.length + 1),
          ...userData,
          createdAt: new Date()
        };
        mockUsers.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        resolve({
          token: `mock-token-${newUser.id}`,
          user: userWithoutPassword
        });
      }, 500);
    });
  },

  updateProfile: (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(u => u.id === formData.id);
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...formData,
          updatedAt: new Date()
        };

        const { password, ...userWithoutPassword } = mockUsers[userIndex];
        resolve({ user: userWithoutPassword });
      }, 500);
    });
  },

  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          resolve(JSON.parse(userJson));
        } else {
          reject({ response: { data: { error: 'User not found' } } });
        }
      }, 300);
    });
  },

  // Babysitter functions
  getBabysitters: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBabysitters);
      }, 300);
    });
  },

  getBabysitter: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const babysitter = mockBabysitters.find(b => b.id === id);
        if (babysitter) {
          resolve(babysitter);
        } else {
          reject({ response: { data: { error: 'Babysitter not found' } } });
        }
      }, 300);
    });
  },

  createBabysitter: (babysitterData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBabysitter = {
          id: String(mockBabysitters.length + 1),
          ...babysitterData,
          createdAt: new Date()
        };
        mockBabysitters.push(newBabysitter);
        resolve(newBabysitter);
      }, 500);
    });
  },

  updateBabysitter: (id, babysitterData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBabysitters.findIndex(b => b.id === id);
        if (index !== -1) {
          mockBabysitters[index] = { ...mockBabysitters[index], ...babysitterData };
          resolve(mockBabysitters[index]);
        } else {
          reject({ response: { data: { error: 'Babysitter not found' } } });
        }
      }, 500);
    });
  },

  deleteBabysitter: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBabysitters.findIndex(b => b.id === id);
        if (index !== -1) {
          mockBabysitters.splice(index, 1);
          resolve({ message: 'Babysitter deleted successfully' });
        } else {
          reject({ response: { data: { error: 'Babysitter not found' } } });
        }
      }, 500);
    });
  },

  // Children functions
  getChildren: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockChildren);
      }, 500);
    });
  },

  getChild: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const child = mockChildren.find(c => c.id === id);
        if (child) {
          resolve(child);
        } else {
          reject({ response: { data: { error: 'Child not found' } } });
        }
      }, 300);
    });
  },

  createChild: (childData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newChild = {
          id: String(mockChildren.length + 1),
          ...childData,
          createdAt: new Date()
        };
        mockChildren.push(newChild);
        resolve(newChild);
      }, 500);
    });
  },

  updateChild: (id, childData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockChildren.findIndex(c => c.id === id);
        if (index !== -1) {
          mockChildren[index] = { ...mockChildren[index], ...childData };
          resolve(mockChildren[index]);
        } else {
          reject({ response: { data: { error: 'Child not found' } } });
        }
      }, 500);
    });
  },

  deleteChild: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockChildren.findIndex(c => c.id === id);
        if (index !== -1) {
          mockChildren.splice(index, 1);
          resolve({ message: 'Child deleted successfully' });
        } else {
          reject({ response: { data: { error: 'Child not found' } } });
        }
      }, 500);
    });
  },

  getChildrenByParent: (parentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const children = mockChildren.filter(child => child.parentId === parentId);
        resolve(children);
      }, 500);
    });
  },

  // Finance functions
  getFinances: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFinances);
      }, 300);
    });
  },

  getFinance: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const finance = mockFinances.find(f => f.id === id);
        if (finance) {
          resolve(finance);
        } else {
          reject({ response: { data: { error: 'Finance record not found' } } });
        }
      }, 300);
    });
  },

  createFinance: (financeData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFinance = {
          id: String(mockFinances.length + 1),
          ...financeData,
          createdAt: new Date()
        };
        mockFinances.push(newFinance);
        resolve(newFinance);
      }, 500);
    });
  },

  updateFinance: (id, financeData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFinances.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFinances[index] = { ...mockFinances[index], ...financeData };
          resolve(mockFinances[index]);
        } else {
          reject({ response: { data: { error: 'Finance record not found' } } });
        }
      }, 500);
    });
  },

  deleteFinance: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFinances.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFinances.splice(index, 1);
          resolve({ message: 'Finance record deleted successfully' });
        } else {
          reject({ response: { data: { error: 'Finance record not found' } } });
        }
      }, 500);
    });
  },

  // Notifications functions
  getNotifications: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNotifications), 500);
    });
  },

  getNotification: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notification = mockNotifications.find(n => n.id === id);
        if (notification) {
          resolve(notification);
        } else {
          reject({ response: { data: { error: 'Notification not found' } } });
        }
      }, 300);
    });
  },

  createNotification: (notificationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotification = {
          id: String(mockNotifications.length + 1),
          ...notificationData,
          createdAt: new Date()
        };
        mockNotifications.push(newNotification);
        resolve(newNotification);
      }, 500);
    });
  },

  updateNotification: (id, notificationData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockNotifications.findIndex(n => n.id === id);
        if (index !== -1) {
          mockNotifications[index] = { ...mockNotifications[index], ...notificationData };
          resolve(mockNotifications[index]);
        } else {
          reject({ response: { data: { error: 'Notification not found' } } });
        }
      }, 500);
    });
  },

  deleteNotification: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockNotifications.findIndex(n => n.id === id);
        if (index !== -1) {
          mockNotifications.splice(index, 1);
          resolve({ message: 'Notification deleted successfully' });
        } else {
          reject({ response: { data: { error: 'Notification not found' } } });
        }
      }, 500);
    });
  },

  getNotificationsByUser: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userNotifications = mockNotifications.filter(n => n.userId === userId);
        resolve(userNotifications);
      }, 500);
    });
  },

  markNotificationAsRead: (notificationId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          resolve(notification);
        } else {
          reject(new Error('Notification not found'));
        }
      }, 500);
    });
  },

  // Events functions
  getEvents: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 500);
    });
  },

  getEvent: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === id);
        if (event) {
          resolve(event);
        } else {
          reject(new Error('Event not found'));
        }
      }, 500);
    });
  },

  createEvent: (eventData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          id: String(mockEvents.length + 1),
          ...eventData,
          createdAt: new Date()
        };
        mockEvents.push(newEvent);
        resolve(newEvent);
      }, 500);
    });
  },

  updateEvent: (id, eventData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockEvents.findIndex(e => e.id === id);
        if (index !== -1) {
          mockEvents[index] = { ...mockEvents[index], ...eventData };
          resolve(mockEvents[index]);
        } else {
          reject({ response: { data: { error: 'Event not found' } } });
        }
      }, 500);
    });
  },

  deleteEvent: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockEvents.findIndex(e => e.id === id);
        if (index !== -1) {
          mockEvents.splice(index, 1);
          resolve({ message: 'Event deleted successfully' });
        } else {
          reject({ response: { data: { error: 'Event not found' } } });
        }
      }, 500);
    });
  },

  // Payments functions
  getPayments: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPayments);
      }, 500);
    });
  },

  getPayment: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const payment = mockPayments.find(p => p.id === id);
        if (payment) {
          resolve(payment);
        } else {
          reject({ response: { data: { error: 'Payment not found' } } });
        }
      }, 300);
    });
  },

  createPayment: (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPayment = {
          id: String(mockPayments.length + 1),
          ...paymentData,
          createdAt: new Date()
        };
        mockPayments.push(newPayment);
        resolve(newPayment);
      }, 500);
    });
  },

  updatePayment: (id, paymentData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPayments.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPayments[index] = { ...mockPayments[index], ...paymentData };
          resolve(mockPayments[index]);
        } else {
          reject({ response: { data: { error: 'Payment not found' } } });
        }
      }, 500);
    });
  },

  deletePayment: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPayments.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPayments.splice(index, 1);
          resolve({ message: 'Payment deleted successfully' });
        } else {
          reject({ response: { data: { error: 'Payment not found' } } });
        }
      }, 500);
    });
  },

  getPaymentsByParent: (parentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payments = mockPayments.filter(payment => payment.parentId === parentId);
        resolve(payments);
      }, 500);
    });
  },

  // User management functions
  getUsers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 500);
    });
  },

  getUsersByRole: (role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = mockUsers.filter(user => user.role === role);
        resolve(users);
      }, 500);
    });
  },

  getUser: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  },

  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some(u => u.email === userData.email)) {
          reject(new Error('User with this email already exists'));
          return;
        }
        const newUser = {
          id: String(mockUsers.length + 1),
          ...userData,
          createdAt: new Date()
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },

  updateUser: (id, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        mockUsers[index] = {
          ...mockUsers[index],
          ...userData,
          updatedAt: new Date()
        };
        resolve(mockUsers[index]);
      }, 500);
    });
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        mockUsers.splice(index, 1);
        resolve({ message: 'User deleted successfully' });
      }, 500);
    });
  },

  getScheduleByStaff: (staffId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const staffSchedule = mockSchedule.filter(s => s.staffId === staffId);
        resolve(staffSchedule);
      }, 500);
    });
  },
};

export default mockApi; 