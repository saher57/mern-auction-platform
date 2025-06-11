import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';

const socket = io('http://localhost:5000');

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [auction, setAuction] = useState(null);
  const [bid, setBid] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/auctions/${id}`)
      .then(res => setAuction(res.data))
      .catch(err => console.error(err));

    socket.on('bidUpdate', (updatedAuction) => {
      if (updatedAuction._id === id) {
        setAuction(updatedAuction);
      }
    });

    return () => socket.off('bidUpdate');
  }, [id]);

  const placeBid = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/api/auctions/${id}/bid`, 
      { amount: bid }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
      .then(res => {
        console.log('Bid placed');
        setBid('');
      })
      .catch(err => console.error(err));
  };

const highestBid = auction?.bids?.length
  ? auction.bids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), auction.bids[0])
  : null;

const highestBidderName = highestBid?.bidder?.username || 'N/A';

console.log('highestBidderName',highestBidderName);

  if (!auction) return <div>Loading...</div>;

  const isEnded = new Date(auction.endTime) < new Date();
  const isWinner = user && auction.winner === user._id;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{auction.title}</h2>
      <p>Current Bid: ${auction.currentBid}</p>
      <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
      {!isEnded && user?.role === 'buyer' && (
        <form onSubmit={placeBid} className="my-4">
          <input
            type="number"
            placeholder="Enter bid"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            className="border p-2 mr-2"
            aria-label="Bid amount"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Place Bid
          </button>
        </form>
      )}
     {highestBid && (
  <p>
    Highest Bidder: {highestBid.bidder?.username || "N/A"} (${highestBid.amount})
  </p>
)}
      {isEnded && isWinner && (
        <PaymentForm auctionId={auction._id} amount={auction.currentBid} />
      )}
      {isEnded && !isWinner && <p className="text-red-500">Auction has ended.</p>}
    </div>
  );
};

export default AuctionDetail;