import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Fetching user with token:', token);
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel('Request timed out');
      }, 2000); // 2-second timeout

      axios
        .get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        })
        .then((response) => {
          console.log('User fetched on load:', response.data);
          setUser(response.data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.error('User fetch timed out:', error.message);
          } else {
            console.error('Failed to fetch user:', error.message);
          }
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
    } else {
      console.log('No token found, skipping user fetch');
      setLoading(false);
    }
  }, []);

  const signup = async (username, email, password) => {
    try {
      console.log('Sending signup request:', { username, email, password });
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      console.log('Signup successful:', user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error.message);
      console.error('Signup error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Sending login request:', { email, password });
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      console.log('Login successful:', user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (username, email) => {
    const token = localStorage.getItem('token');

    
    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/update',
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.user); // Update context user
      console.log(response.data.user,'auth section user');
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Update profile error:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };