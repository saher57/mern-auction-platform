import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/auctions');
    } else {
      setError(result.error);
    }
  };

  return (
   /* <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '5px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '5px', margin: '5px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', width: '100%' }}>Login</button>
      </form>
    </div>*/
   /* <div
  style={{
    padding: '30px',
    maxWidth: '400px',
    margin: '50px auto',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  }}
>
  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
  <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
    </div>
    <button
      type="submit"
      style={{
        padding: '10px',
        width: '100%',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Login
    </button>
  </form>
    <a href='/signup' style={{marginTop:'200px'}}>
      <button >
        signup
      </button>
    </a>
</div>*/
<div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
  <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

  {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-gray-700 font-medium mb-1">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      Login
    </button>
  </form>

  <div className="text-center mt-6">
    <p className="text-[18px]">
      Don't have an account?{' '}
      <a href="/signup" className="text-blue-600 hover:underline">
        Signup
      </a>
    </p>
  </div>
</div>

  );
};

export default Login;