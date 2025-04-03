// Mock API service for authentication
export const login = async (email, password) => {
  // This is now handled by localStorage in the Login component
  return Promise.resolve({ token: 'mock-token', user: { id: 1, email } });
};

export const register = async (username, firstName, middleName, email, password) => {
  // This is now handled by localStorage in the Signup component
  return Promise.resolve({ success: true });
}; 