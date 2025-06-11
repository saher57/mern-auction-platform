import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auctions');
        setAuctions(res.data);
      } catch (error) {
        console.error('Error fetching auctions:', error.message);
      }
    };

    fetchAuctions();

    socket.on('bidUpdate', (updatedAuction) => {
      setAuctions((prev) =>
        prev.map((auction) =>
          auction._id === updatedAuction._id ? updatedAuction : auction
        )
      );
    });

    return () => socket.off('bidUpdate');
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <h2>Auction Listings</h2>
      {auctions.length === 0 ? (
        <p>No auctions available</p>
      ) : (
        auctions.map((auction) => (
          <div key={auction._id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold">{auction.title}</h2>
            <p>Current Bid: ${auction.currentBid}</p>
            <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
            <Link to={`/auctions/${auction._id}`} className="text-blue-500">
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default AuctionList;