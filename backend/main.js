const express = require("express");
const path = require("path");
const cors = require("cors");
const fetchproductRouter = require("./src/api/product"); // Correct import
const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

// Middleware to parse JSON
app.use(express.json());

// Test API endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Use the product router for `/fetchproduct`
app.use("/fetchproduct", fetchproductRouter);

// Serve static files from React (in production)
app.use(express.static(path.join(__dirname, "../dist"))); // Ensure React build is in `../start`

// Catch-all route for React (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
