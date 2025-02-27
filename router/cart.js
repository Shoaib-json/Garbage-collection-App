const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
// const { checkAuth } = require('../utils/middleware');

// ========== VIEW CART ==========
router.get('/', /*checkAuth,*/ (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  let total = 0;
  req.session.cart.forEach(item => {
    total += item.price * item.quantity;
  });
  res.render('shop/cart.ejs', { cart: req.session.cart, total });
});

// ========== ADD ITEM TO CART ==========
router.post('/add/:id', /*checkAuth,*/ async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Shop.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if item already in cart
    let existingItem = req.session.cart.find(item => item.productId == productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({
        productId: product._id,
        caption: product.caption,
        price: product.price,
        quantity: 1
      });
    }

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding to cart');
  }
});

// ========== REMOVE ITEM FROM CART ==========
router.post('/remove/:id', /*checkAuth,*/ (req, res) => {
  const productId = req.params.id;
  if (!req.session.cart) req.session.cart = [];

  req.session.cart = req.session.cart.filter(item => item.productId != productId);
  res.redirect('/cart');
});

// ========== UPDATE ITEM QUANTITY ==========
router.post('/update/:id', /*checkAuth,*/ (req, res) => {
  const productId = req.params.id;
  const newQuantity = parseInt(req.body.quantity);

  if (!req.session.cart) req.session.cart = [];

  let item = req.session.cart.find(i => i.productId == productId);
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
  } else if (item && newQuantity <= 0) {
    req.session.cart = req.session.cart.filter(i => i.productId != productId);
  }

  res.redirect('/cart');
});

module.exports = router;
