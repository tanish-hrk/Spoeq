const express = require("express");
const router = express.Router();

// Mock data
const data = [
  {
    name: "Premium Yoga Mat",
    rating: 4.5,
    price: "79.99",
    originalPrice: "99.99",
    stock: "In Stock",
    badge: "-20%",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Smart Fitness Watch",
    rating: 5.0,
    price: "149.99",
    stock: "In Stock",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Pro Basketball",
    rating: 4.0,
    price: "29.99",
    stock: "In Stock",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Training Dumbbells Set",
    rating: 4.5,
    price: "89.99",
    stock: "Low Stock",
    image:
      "https://images.pexels.com/photos/5580069/pexels-photo-5580069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

// Route to fetch product data
router.get("/", (req, res) => {
  res.json({ data, message: "Products fetched successfully!" });
});

module.exports = router;
