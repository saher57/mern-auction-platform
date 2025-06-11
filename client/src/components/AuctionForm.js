import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuctionForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  // Ensure user exists before accessing its properties
  if (!user) {
    return <div>Please log in to create an auction.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      const response = await axios.post(
        'http://localhost:5000/api/auctions',
        {
          title,
          description,
          startingBid: Number(startingBid),
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );


      navigate('/auctions'); // Redirect to the auctions page
    } catch (error) {
      console.error('Error creating auction:', error);
      setError(error.response?.data?.message || 'Failed to create auction');
    }
  };

  return (
    /*<div style={{ padding: '20px' }}>
      <h3>Create Auction (by {user.username})</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Starting Bid:</label>
          <input
            type="number"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px' }}>
          Create Auction
        </button>
      </form>
    </div>*/
    <div
  style={{
    padding: '30px',
    maxWidth: '500px',
    margin: '50px auto',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  }}
>
  <h3 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '24px' }}>
    Create Auction <span style={{ fontWeight: 'normal' }}>(by {user.username})</span>
  </h3>

  {error && (
    <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
  )}

  <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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

    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
          minHeight: '80px',
        }}
      />
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>Starting Bid:</label>
      <input
        type="number"
        value={startingBid}
        onChange={(e) => setStartingBid(e.target.value)}
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
      <label style={{ display: 'block', marginBottom: '5px' }}>End Time:</label>
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
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
      Create Auction
    </button>
  </form>
</div>

  );
};

export default AuctionForm;