import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    useremail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.useremail.trim()) {
      newErrors.useremail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.useremail)) {
      newErrors.useremail = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await login({
      useremail: formData.useremail,
      password: formData.password
    });

    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account
            </p>
          </div>

          <div className="card-body">
            {authError && (
              <div className="alert alert-error">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="useremail" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="useremail"
                  name="useremail"
                  value={formData.useremail}
                  onChange={handleChange}
                  className={`form-input ${errors.useremail ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.useremail && (
                  <p className="text-red-500 text-sm mt-1">{errors.useremail}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner mr-2"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <div className="card-footer text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="btn-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;