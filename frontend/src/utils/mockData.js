let mockUsers = [
  {
    id: '1',
    firstName: 'Bruce',
    lastName: 'Wayne',
    email: 'bruce@wayneenterprises.com',
    password: 'iAmBatman', // Still needs hashing!
    role: 'manager',
    phoneNumber: '212-555-0001',
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    firstName: 'Harleen',
    lastName: 'Quinzel',
    email: 'harleen@arkhamcare.org',
    password: 'puddin123',
    role: 'babysitter',
    phoneNumber: '212-555-0020',
    createdAt: new Date('2025-01-02')
  },
  {
    id: '3',
    firstName: 'Selina',
    lastName: 'Kyle',
    email: 'selina@gothammail.com',
    password: 'catwoman',
    role: 'parent',
    phoneNumber: '212-555-0033',
    createdAt: new Date('2025-01-10')
  },
  {
    id: '4',
    firstName: 'Edward',
    lastName: 'Nygma',
    email: 'edward@riddleme.com',
    password: 'riddler2025',
    role: 'parent',
    phoneNumber: '212-555-0044',
    createdAt: new Date('2025-02-01')
  }
];

const mockBabysitters = [
  {
    id: '1',
    userId: '2',
    firstName: 'Alfred',
    lastName: 'Pennyworth',
    email: 'alfred@wayneestate.org',
    phoneNumber: '212-555-1000',
    address: 'Wayne Manor, Gotham',
    emergencyContact: 'Bruce Wayne (212-555-0001)',
    availability: 'Monday-Friday, 8am-5pm',
    qualifications: 'Former MI6, CPR Certified, Gourmet Chef',
    status: 'active',
    createdAt: new Date('2025-01-02')
  },
  {
    id: '2',
    userId: '2',
    firstName: 'Harleen',
    lastName: 'Quinzel',
    email: 'harleen@arkhamcare.org',
    phoneNumber: '212-555-0020',
    address: 'Arkham Asylum Staff Quarters',
    emergencyContact: 'Pamela Isley (212-555-7777)',
    availability: 'Weekdays only, no weekends',
    qualifications: 'PhD in Psychology, CPR Certified',
    status: 'active',
    createdAt: new Date('2025-01-02')
  },
  {
    id: '3',
    userId: '3',
    firstName: 'Joker',
    lastName: 'Unknown',
    email: 'joker@whySoSerious.net',
    phoneNumber: '212-555-6666',
    address: 'Funhouse Alley, Gotham',
    emergencyContact: 'Harleen Quinzel (212-555-0020)',
    availability: 'Whenever the chaos calls',
    qualifications: 'Expert in laughter therapy, certified balloon artist, totally unhinged',
    status: 'active',
    createdAt: new Date('2023-03-05')
  }
  
];

const mockChildren = [
  {
    id: '1',
    firstName: 'Helena',
    lastName: 'Kyle',
    dateOfBirth: new Date('2018-05-15'),
    gender: 'female',
    parentId: '3',
    parentName: 'Selina Kyle',
    parentPhone: '212-555-0033',
    parentEmail: 'selina@gothammail.com',
    address: 'East End, Gotham City',
    emergencyContact: 'Holly Robinson (212-555-3333)',
    medicalInfo: 'Mild cat allergy',
    enrollmentDate: new Date('2025-01-10'),
    status: 'active',
    createdAt: new Date('2025-01-10')
  },
  {
    id: '2',
    firstName: 'Enigma',
    lastName: 'Nygma',
    dateOfBirth: new Date('2019-03-20'),
    gender: 'male',
    parentId: '4',
    parentName: 'Edward Nygma',
    parentPhone: '212-555-0044',
    parentEmail: 'edward@riddleme.com',
    address: 'Riddle Tower, Gotham',
    emergencyContact: 'Oswald Cobblepot (212-555-6666)',
    medicalInfo: 'Asthma',
    enrollmentDate: new Date('2025-02-01'),
    status: 'active',
    createdAt: new Date('2025-02-01')
  },
  {
    id: '6',
    firstName: 'Rowan',
    lastName: 'Hood',
    dateOfBirth: new Date('2020-12-01'),
    gender: 'male',
    parentId: '8', // Link to Robin Hood
    parentName: 'Robin Hood',
    parentPhone: '212-555-1212',
    parentEmail: 'robin@shireforest.org',
    address: 'Sherwood Alley, Gotham',
    emergencyContact: 'Maid Marian (212-555-5656)',
    medicalInfo: 'Allergic to bees',
    enrollmentDate: new Date('2025-04-01'),
    status: 'active',
    createdAt: new Date('2025-04-01')
  }
  
];

const mockFinances = [
  {
    id: '1',
    type: 'income',
    amount: 1500,
    description: 'Monthly tuition - Helena Kyle',
    date: new Date('2025-03-01'),
    category: 'tuition',
    status: 'completed',
    createdAt: new Date('2025-03-01')
  },
  {
    id: '2',
    type: 'expense',
    amount: 750,
    description: 'Bat-themed play equipment',
    date: new Date('2025-03-05'),
    category: 'supplies',
    status: 'completed',
    createdAt: new Date('2025-03-05')
  },
  {
    id: '3',
    type: 'income',
    amount: 1500,
    description: 'Monthly tuition - Enigma Nygma',
    date: new Date('2025-03-01'),
    category: 'tuition',
    status: 'completed',
    createdAt: new Date('2025-03-01')
  }
];

const mockNotifications = [
  {
    id: '1',
    userId: '1',
    title: 'New Enrollment',
    message: 'Enigma Nygma has been enrolled in Gotham Little League.',
    type: 'info',
    read: false,
    createdAt: new Date('2025-02-01')
  },
  {
    id: '2',
    userId: '1',
    title: 'Payment Received',
    message: 'Payment of $1500 received from Selina Kyle.',
    type: 'success',
    read: true,
    createdAt: new Date('2025-03-01')
  },
  {
    id: '3',
    userId: '1',
    title: 'Upcoming Event',
    message: 'Gotham Spring Festival is next week.',
    type: 'warning',
    read: false,
    createdAt: new Date('2025-03-10')
  },
  {
    id: '4',
    userId: '2',
    title: 'Schedule Update',
    message: 'Your Arkham babysitting hours have changed.',
    type: 'info',
    read: false,
    createdAt: new Date('2025-03-15')
  },
  {
    id: '5',
    userId: '2',
    title: 'New Assignment',
    message: 'You are now watching Helena Kyle.',
    type: 'info',
    read: true,
    createdAt: new Date('2025-03-20')
  }
];

const mockEvents = [
  {
    id: '1',
    title: 'Gotham Spring Festival',
    description: 'Family-friendly day with games and food at Robinson Park.',
    date: new Date('2025-04-10'),
    time: 'All Day',
    type: 'Holiday',
    createdAt: new Date('2025-03-10')
  },
  {
    id: '2',
    title: 'Parent-Teacher Rooftop Meeting',
    description: 'Discuss your child\'s growth under the Gotham moon.',
    date: new Date('2025-04-15'),
    time: '6:00 PM - 8:00 PM',
    type: 'Meeting',
    createdAt: new Date('2025-03-15')
  },
  {
    id: '3',
    title: 'Field Trip to Wayne Tech',
    description: 'Educational trip to see future superheroes in tech.',
    date: new Date('2025-04-20'),
    time: '10:00 AM - 3:00 PM',
    type: 'Activity',
    createdAt: new Date('2025-03-20')
  }
];

const mockPayments = [
  {
    id: '1',
    amount: 1500,
    description: 'Monthly tuition - Helena Kyle',
    date: new Date('2025-03-01'),
    status: 'paid',
    parentId: '3',
    createdAt: new Date('2025-03-01')
  },
  {
    id: '2',
    amount: 1500,
    description: 'Monthly tuition - Enigma Nygma',
    date: new Date('2025-03-01'),
    status: 'pending',
    parentId: '4',
    createdAt: new Date('2025-03-01')
  },
  {
    id: '3',
    amount: 600,
    description: 'After-school detective club - Helena Kyle',
    date: new Date('2025-03-15'),
    status: 'overdue',
    parentId: '3',
    createdAt: new Date('2025-03-15')
  }
];

const mockSchedule = [
  {
    id: '1',
    staffId: '2',
    date: new Date('2025-04-01'),
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    type: 'regular',
    status: 'confirmed'
  },
  {
    id: '2',
    staffId: '2',
    date: new Date('2025-04-02'),
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