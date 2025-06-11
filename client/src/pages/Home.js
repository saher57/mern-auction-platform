import React from 'react';

const Home = () => {
  return (
    /*<div style={{ padding: '20px' }}>
      <h2>Welcome to the Auction Platform</h2>
      <p>Please login or signup to continue.</p>
    </div>*/
    <div
  style={{
    maxWidth: '500px',
    margin: '60px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  }}
>
  <h2 style={{ marginBottom: '15px', fontSize: '24px' }}>
    Welcome to the Auction Platform
  </h2>
  <p style={{ fontSize: '16px', color: '#555' }}>
    Please login or signup to continue.
  </p>
</div>

  );
};

export default Home;