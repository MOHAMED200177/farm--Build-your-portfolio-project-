// Import required modules
const express = require('express');
const fs = require('fs');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate'); // Import a custom module

// Create an Express app
const app = express();
const port = 8000; // Define the port number

// Read HTML templates and data from files
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
); // Read overview template
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
); // Read card template
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
); // Read product template
const tempShopping = fs.readFileSync(
  `${__dirname}/templates/template-shopping.html`,
  'utf-8'
); // Read shopping template
const tempinf = fs.readFileSync(
  `${__dirname}/templates/template-inf.html`,
  'utf-8'
); // Read information template
const templanding = fs.readFileSync(`${__dirname}/index2.html`, 'utf-8'); // Read landing page template
const templogin = fs.readFileSync(`${__dirname}/login.html`, 'utf-8'); // Read login page template
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); // Read JSON data

// Parse JSON data
const dataObj = JSON.parse(data); // Convert JSON data to JavaScript object

// Generate slugs for products
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true })); // Create slugs for each product

// Define routes

// Route for landing page
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(templanding); // Serve landing page
});

// Route for login page
app.get('/login', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(templogin); // Serve login page
});

// Route for overview page with product cards
app.get('/overview', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join(''); // Generate HTML for product cards
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml); // Replace placeholder with product cards
  res.end(output); // Serve overview page with product cards
});

// Route for individual product pages
app.get('/product', (req, res) => {
  const productId = parseInt(req.query.id); // Get product ID from query parameters
  const product = dataObj.find((item) => item.id === productId); // Find product by ID

  if (!product) {
    res.status(404).send('<h1>Product not found!</h1>'); // If product not found, send 404 response
    return;
  }

  res.writeHead(200, { 'Content-type': 'text/html' });
  const output = replaceTemplate(tempProduct, product); // Generate HTML for product page
  res.end(output); // Serve product page
});

// Route for shopping cart page
app.get('/shopping-cart', (req, res) => {
  const productId = parseInt(req.query.id); // Get product ID from query parameters
  const product = dataObj.find((item) => item.id === productId); // Find product by ID

  if (!product) {
    res.status(404).send('<h1>Product not found!</h1>'); // If product not found, send 404 response
    return;
  }

  res.writeHead(200, { 'Content-type': 'text/html' });
  const output = replaceTemplate(tempShopping, product); // Generate HTML for shopping cart page
  res.end(output); // Serve shopping cart page
});

// Route for information page
app.get('/information', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(tempinf); // Serve information page
});

// API endpoint to serve JSON data
app.get('/api', (req, res) => {
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.end(data); // Serve JSON data
});

// Middleware for handling 404 errors
app.use((req, res) => {
  res.writeHead(404, {
    'Content-type': 'text/html',
    'my-own-header': 'hello-world',
  });
  res.end('<h1>Page not found!</h1>'); // Serve 404 page
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`); // Log a message when the server starts
});
