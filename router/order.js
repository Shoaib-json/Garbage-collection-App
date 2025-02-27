const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Shop = require('../models/shop');
// const { checkAuth } = require('../utils/middleware');

// ========== PLACE ORDER ==========
router.post('/create', /*checkAuth,*/ async (req, res) => {
  try {
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).send('Cart is empty');
    }

    let items = [];
    let totalPrice = 0;

    for (let cartItem of req.session.cart) {
      const product = await Shop.findById(cartItem.productId);
      if (!product) continue;

      // If you want to manage stock:
      // if (product.stock < cartItem.quantity) { 
      //   return res.status(400).send('Not enough stock');
      // }
      // product.stock -= cartItem.quantity;
      // await product.save();

      let itemTotal = product.price * cartItem.quantity;
      totalPrice += itemTotal;

      items.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: product.price
      });
    }

    // Create the order
    const order = new Order({
      // user: req.user._id, // if you have user auth
      items,
      totalPrice,
      status: 'Pending'
    });
    await order.save();

    // Clear cart
    req.session.cart = [];

    // Redirect to single order page
    res.redirect('/orders/' + order._id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

// ========== VIEW SINGLE ORDER ==========
router.get('/:orderId', /*checkAuth,*/ async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product');
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.render('shop/orderShow.ejs', { order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching order');
  }
});

// ========== VIEW ALL ORDERS FOR USER ==========
router.get('/', /*checkAuth,*/ async (req, res) => {
  try {
    // If you have user auth:
    // const orders = await Order.find({ user: req.user._id }).populate('items.product');
    const orders = await Order.find({}).populate('items.product'); // all orders for demonstration
    res.render('shop/orders.ejs', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching orders');
  }
});

module.exports = router;
