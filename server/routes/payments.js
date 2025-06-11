const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/payment', async (req, res) => {
  try {
    const { paymentMethodId, amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'inr',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });

    res.status(200).json({ 
      success: true,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
});

module.exports = router;