const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const multer = require('multer');

// Valid File extensions
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

// Img Upload
const storage = multer.diskStorage({
  // Control over image file destination
  destination: function (req, file, cb) {
    const isValidFile = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid IMG type');
    if(isValidFile) {
      uploadError = null
    }
    // If theres an error uploading, we assign dest
    cb(uploadError, 'public/uploads')
  },
  // Creating Unique Filename
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-');
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

// get all products route .select('name image -_id') populate is showing category details on JSON return
router.get(`/`, async (req, res) => {
    // Sets inital filter to empty object to still get back all products
    let filter = {};
  // If theres a category in the query
  if (req.query.categories) {
    // stores categories and splits it by comma
    filter = {category: req.query.categories.split(",")}
  }

  // Filters as user searches products
  const productList = await Product.find(filter).populate(
    "category"
  );

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
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  // Check if category exist
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  // Check if we have file in request
  const file = req.file;
  if (!file) return res.status(400).send("You did not upload a file");

  // Multer IMG
  const fileName = req.file.filename

  // URL Path to IMG
  const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

  // Creating new product with request from body of DOM
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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
router.put("/:id", uploadOptions.single('image'), async (req, res) => {
  // Checks if the ID is wrong
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product ID");
  }
  // Check if category exist
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  // Find Product to check if exists
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Product");

  const file = req.file;
  let imagePath;

  if (file) {
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
    imagePath = `${basePath}${fileName}`
  } else {
    // Uses old img from DB
    imagePath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    // grabs id from url
    req.params.id,

    // pass in values to update
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
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
  if (!updatedProduct) return res.status(404).send("Product was not updated");

  // send to frontend
  res.send(updatedProduct);
});

// Delete Product
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "Product Destroyed" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product not found!" });
      }
      // Server Error
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// Calculates Inventory
router.get(`/get/inventory`, async (req, res) => {
  const productCount = await Product.countDocuments();
  // If theres no products
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

// Grabs Featured Products
router.get(`/get/featured/:count`, async (req, res) => {
  // Grabs count or sets it to 0
  const count = req.params.count ? req.params.count : 0;

  const featProduct = await Product.find({ isFeatured: true }).limit(+count);

  // If theres no products
  if (!featProduct) {
    res.status(500).json({ success: false });
  }
  res.send(featProduct);
});

// Gallery
router.put("/gallery-images/:id", uploadOptions.array('images', 15), async (req, res) => {
    // Checks if the ID is wrong
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product ID");
  }
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  if (files) {
    files.map(file => {
        imagesPaths.push(`${basePath}${file.filename}`);
    })
  }


  const gallery = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesPaths
    },
    // Sends back updated data instead of old data to console
    { new: true }
  );
  // if theres no category
  if (!gallery) return res.status(404).send("Gallery was not updated");

  // send to frontend
  res.send(gallery);
})

module.exports = router;
