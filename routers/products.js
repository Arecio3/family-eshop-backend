const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");

// get all products route .select('name image -_id') populate is showing category details on JSON return
router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate("category");
  // If theres no products
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// get all products route
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id);
  // If theres no products
  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});
// post product route
router.post(`/`, async (req, res) => {
  // Check if category exist
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  // Creating new product with request from body of DOM
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    condition: req.body.condition,
  });
  // Save to DB
  product = await product.save();

  if (!product) return res.status(500).send("Product was not created!");

  res.send(product);
});

// Update Product
router.put("/:id", async (req, res) => {
    // Check if category exist
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    // grabs id from url
    req.params.id,
    // pass in values to update
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      condition: req.body.condition,
    },
    // Sends back updated data instead of old data to console
    { new: true }
  );

  // if theres no category
  if (!product) return res.status(404).send("Product was not updated");

  // send to frontend
  res.send(product);
});

// Delete Product
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({success: true, message: "Product Destroyed"})
        } else {
            return res.status(404).json({success: false, message: 'Product not found!'})
        }
    // Server Error 
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;
