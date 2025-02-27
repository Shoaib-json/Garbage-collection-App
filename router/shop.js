const express = require('express');
const router = express.Router();
const multer  = require('multer');
const { storage } = require('../cloudconfig'); // or local if you want
const upload = multer({ storage }); // configure as needed

const Shop = require('../models/shop');
const { checkAuth } = require('../utils/middleware'); // optional auth check

// ========== GET ALL PRODUCTS ==========
router.get('/', async (req, res) => {
  try {
    // Optional: search and category filter
    let filter = {};
    if (req.query.search) {
      filter.caption = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Shop.find(filter).sort({ createdAt: -1 });
    res.render('shop/home.ejs', { q: products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});

// ========== ADD PRODUCT FORM ==========
router.get('/add', /*checkAuth,*/ (req, res) => {
  // checkAuth => only logged-in user can add product
  res.render('shop/add.ejs');
});

// ========== CREATE PRODUCT (POST) ==========
router.post('/submit', /*checkAuth,*/ upload.array('image', 5), async (req, res) => {
  try {
    let { caption, description, price, category, stock } = req.body;

    // handle images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
      }));
    }

    const product = new Shop({
      caption,
      description,
      price,
      category,
      stock,
      image: images,
      // user: req.user._id // if using user accounts
    });

    await product.save();
    console.log('Product saved:', product);
    res.redirect('/shop'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating product');
  }
});

// ========== GET SINGLE PRODUCT ==========
router.get('/:id', async (req, res) => {
  try {
    const product = await Shop.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('shop/show.ejs', { q: product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching product');
  }
});

module.exports = router;
