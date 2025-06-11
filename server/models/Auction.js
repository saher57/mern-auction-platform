const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const auctionSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
    required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    
    creator: {
      type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
      required: true,
    },
    bids: [bidSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    },
});

module.exports = mongoose.model('Auction', auctionSchema);