const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Apply CORS middleware
app.use(cors({
  origin: 'https://karanbookstore.netlify.app', // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Handle preflight (OPTIONS) requests for CORS
app.options('/verify-payment', (req, res) => {
  console.log('Received preflight request');
  res.setHeader('Access-Control-Allow-Origin', 'https://karanbookstore.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, '../public')));

// Endpoint for verifying payment
app.post('/verify-payment', (req, res) => {
  const { payment_id, order_id, signature } = req.body;
  const secret = process.env.RAZORPAY_SECRET;

  // Generate the HMAC signature
  const hmac = crypto.createHmac('sha256', secret);
  const generated_signature = hmac.update(`${order_id}|${payment_id}`).digest('hex');

  if (signature === generated_signature) {
    console.log('Payment verification successful');
    res.status(200).send({ success: true });
  } else {
    console.log('Payment verification failed');
    res.status(400).send({ success: false });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
