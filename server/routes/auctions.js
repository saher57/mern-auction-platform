const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const authMiddleware = require('../middleware/auth');

// Get all auctions
router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find().populate('creator', 'username');
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
)


// Get a single auction by ID
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate(
      'creator',
      'username'
    )
    .populate('bids.bidder', 'username');
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.json(auction);
  } catch (error) {
    console.error('Error fetching auction:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// New route to check if an auction exists by title
router.get('/check/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const auction = await Auction.findOne({ title });
    if (!auction) {
      return res.status(404).json({ message: `Auction with title "${title}" not found` });
    }
    console.log(`Found auction with title "${title}":`, auction);
    res.json(auction);
  } catch (error) {
    console.error('Error checking auction:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Create a new auction
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, startingBid, endTime } = req.body;

  try {
    if (!title || !description || !startingBid || !endTime) {
      console.log('Missing required fields:', { title, description, startingBid, endTime });
      return res.status(400).json({ message: 'All fields are required' });
    }

    const endTimeDate = new Date(endTime);
    if (isNaN(endTimeDate.getTime())) {
      console.log('Invalid endTime format:', endTime);
      return res.status(400).json({ message: 'Invalid endTime format' });
    }

    console.log('Creating auction with data:', {
      title,
      description,
      startingBid,
      endTime: endTimeDate,
      creator: req.user.userId,
    });

    const auction = new Auction({
      title,
      description,
      startingBid,
      currentBid: startingBid,
      endTime: endTimeDate,
      creator: req.user.userId,
    });

    const savedAuction = await auction.save();
    console.log('Auction saved to database:', savedAuction);

    const io = req.app.get('io');
    io.emit('newAuction', savedAuction);
    console.log('Emitted newAuction event:', savedAuction);

    res.status(201).json({
      message: `Auction created by ${req.user.username}`,
      auction: savedAuction,
    });
  } catch (error) {
    console.error('Error creating auction:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Place a bid on an auction
router.put('/:id/bid', authMiddleware, async (req, res) => {
  const { bidAmount } = req.body;

  try {
    const auction = await Auction.findById(req.params.id).populate('bids.bidder', 'username');
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (new Date(auction.endTime) < new Date()) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (bidAmount <= auction.currentBid) {
      return res
        .status(400)
        .json({ message: 'Bid must be higher than the current bid' });
    }

    auction.currentBid = bidAmount;
    auction.bids.push({ bidder: req.user.userId, amount: bidAmount });
    await auction.save();
    console.log('Bid placed:', { auctionId: auction._id, bidAmount });

    const io = req.app.get('io');
    io.emit('bidUpdate', auction);
    console.log('Emitted bidUpdate event:', auction);

    res.json(auction);
  } catch (error) {
    console.error('Error placing bid:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// router.put('/:id/bid', authMiddleware, async (req, res) => {
//   const { bidAmount } = req.body;
//   try {
//     const auction = await Auction.findById(req.params.id).populate('bids.bidder', 'username');
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     if (new Date(auction.endTime) < new Date()) {
//       return res.status(400).json({ message: 'Auction has ended' });
//     }

//     if (bidAmount <= auction.currentBid) {
//       return res.status(400).json({ message: 'Bid must be higher than current bid' });
//     }

//     auction.currentBid = bidAmount;
//     const updatedAuction = await auction.save();

//     const io = req.app.get('io');
//     io.emit('bidUpdate', updatedAuction);

//     res.json({ message: 'Bid placed successfully', auction: updatedAuction });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


module.exports = router;