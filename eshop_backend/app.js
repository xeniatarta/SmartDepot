require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const stripeWebhookController = require('./src/controllers/stripe.webhook.controller');

const app = express();

/**
 * STRIPE WEBHOOK
 * (obligatoriu înainte de express.json)
 */
app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    stripeWebhookController.handleStripeWebhook
);

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:5173'
    ],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// User routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/products', require('./src/routes/products.routes'));
app.use('/api/cart', require('./src/routes/cart.routes'));
app.use('/api/orders', require('./src/routes/orders.routes'));
app.use('/api/account', require('./src/routes/account.routes'));

// Admin routes
app.use('/api/admin/products', require('./src/routes/admin.products.routes'));
app.use('/api/admin/orders', require('./src/routes/admin.orders.routes'));
app.use('/api/admin/users', require('./src/routes/admin.users.routes'));
app.use('/api/admin/reviews', require('./src/routes/admin.reviews.routes'));

// Other routes
app.use('/api', require('./src/routes/reviews.routes'));
app.use('/api/financing', require('./src/routes/financing.routes'));
app.use('/api/returns', require('./src/routes/returns.routes'));
app.use('/api/chat', require('./src/routes/chat.routes'));
app.use('/api/contact', require('./src/routes/contact.routes'));

// Health check
app.get('/', (req, res) => {
    res.send('E-Shop API is running...');
});

// Start server (ULTIMA PARTE)
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
