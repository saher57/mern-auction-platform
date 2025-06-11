const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Auction = require('../models/Auction');
const User = require('../models/User');
const Dispute = require('../models/Dispute');
const router = express.Router();

// Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//   if (req.user.role != 'admin') {
//     return res.status(403).json({ error: 'Access denied, admin only' });
//   }
//   next();
// };

// Get all auctions
router.get('/auctions', auth, async (req, res) => {
  try {
    const auctions = await Auction.find();
    console.log(auctions,'server side auctions');
    
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
router.get('/users', auth,  async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all disputes
router.get('/disputes', auth, async (req, res) => {
  try {
    const disputes = await Dispute.find().populate('auction user');
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update dispute status
router.put('/disputes/:id', auth, [
  body('status').isIn(['open', 'resolved', 'closed'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;

  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    dispute.status = status;
    await dispute.save();
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// router.delete('/:id', auth, async (req, res) => {
//   const { id } = req.params;
//   await Auction.findByIdAndDelete(id);
//   res.status(200).json({ message: 'Auction deleted successfully' });
// });

router.delete('/:id', auth, async (req, res) => {
  console.log('Delete request received for ID:', req.params.id); // debug
  try {
    await Auction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (err) {
    console.error('Deletion failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;