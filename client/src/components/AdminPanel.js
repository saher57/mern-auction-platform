import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [auctions, setAuctions] = useState([]);
  const [disputes, setDisputes] = useState([]);

  const token = localStorage.getItem('token');


  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/admin/auctions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setAuctions(res.data);
          console.log(res.data, 'Fetched auctions');
        })
        .catch(err => {
          console.error('Auction fetch error:', err.response?.data || err.message);
        });
    }
  }, [user])

  const deleteAuction = (auctionId) => {
    axios.delete(`http://localhost:5000/api/admin/${auctionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setAuctions(prev => prev.filter(a => a._id !== auctionId)))
      .catch(err => console.error('Delete error:', err.response?.data || err.message));
  };

  console.log(deleteAuction,'front end code ');
  

  if (user?.role !== 'admin') return null;

  return (
    <div className="container  mx-auto p-4">
      <h2 className="text-2xl justify-center font-bold mb-4">Admin Panel</h2>
      <h3 className="text-[50px] mb-2 ">Manage Auctions</h3>
      <h5 className="text-[28px] mb-2 ">All Auctions:</h5>
      {auctions.map(auction => (
        <div key={auction._id} className="border p-4 mb-2 flex justify-between">
          <span>{auction.title}</span>
          <button
            onClick={() => deleteAuction(auction._id)}
            className="bg-red-500 text-white p-2 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;



