import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // adjust path accordingly

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(form.username, form.email);
    console.log(result,'result');
    
    if (result.success) {
      setMessage('Profile updated successfully');
    } else {
      setMessage(result.error);
    }
  };

  return (
   /* <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} />
        </label>
        <br /><br />
        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <br /><br />
        <button type="submit">Update</button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>*/
    <div
  style={{
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    fontFamily: 'Arial, sans-serif',
  }}
>
  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Profile</h2>
  <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
    </div>
    <button
      type="submit"
      style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Update
    </button>
  </form>
  {message && (
    <p style={{ marginTop: '15px', textAlign: 'center', color: 'green' }}>{message}</p>
  )}
</div>

  );
};

export default Profile;
