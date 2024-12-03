const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = 3000;


require('dotenv').config();




app.use(cors({
    origin: ['https://karanbookstore.netlify.app', '*'], // Replace with your actual frontend URL
    methods: ['GET', 'POST'],
  }));


app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());

const SECRET_KEY = process.env.RAZORPAY_SECRET;

app.post('/verify-payment', (req, res) => {
    const secret = SECRET_KEY; // Replace with your Razorpay secret
    const { payment_id, order_id, signature } = req.body;

    // Construct the string to be verified
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
