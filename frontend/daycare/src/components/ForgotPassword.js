import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Get registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if email exists
      const userExists = registeredUsers.some(user => user.email === values.email);
      
      if (!userExists) {
        throw new Error('No account found with this email address');
      }

      // Simulate API call to send reset instructions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">BS</span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">
              Password reset instructions have been sent to your email address.
            </span>
            <div className="mt-4 text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                      errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Spinner size="small" className="mr-2" />
                        <span>Sending instructions...</span>
                      </div>
                    ) : (
                      'Send reset instructions'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        <div className="text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 