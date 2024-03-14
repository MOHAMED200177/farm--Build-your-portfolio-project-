const express = require('express');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const app = express();
const port = 8000;

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempShopping = fs.readFileSync(
  `${__dirname}/templates/template-shopping.html`,
  'utf-8'
);
const tempinf = fs.readFileSync(
  `${__dirname}/templates/template-inf.html`,
  'utf-8'
);

const templanding = fs.readFileSync(`${__dirname}/index2.html`, 'utf-8');
const templogin = fs.readFileSync(`${__dirname}/login.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(templanding);
});

app.get('/login', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(templogin);
});

app.get('/overview', (req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' });
  const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.end(output);
});

app.get('/product', (req, res) => {
  const productId = parseInt(req.query.id);
  const product = dataObj.find((item) => item.id === productId);

  if (!product) {
    res.status(404).send('<h1>Product not found!</h1>');
    return;
  }

  res.writeHead(200, { 'Content-type': 'text/html' });
  const output = replaceTemplate(tempProduct, product);
  res.end(output);
});


app.get('/shopping-cart', (req, res) => {
  const productId = parseInt(req.query.id);
  const product = dataObj.find((item) => item.id === productId);

  if (!product) {
    res.status(404).send('<h1>Product not found!</h1>');
    return;
  }

  res.writeHead(200, { 'Content-type': 'text/html' });
  const output = replaceTemplate(tempShopping, product);
  res.end(output);
});
app.get('/information', (req, res) => {

  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(tempinf);
});

app.get('/api', (req, res) => {
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.end(data);
});

app.use((req, res) => {
  res.writeHead(404, {
    'Content-type': 'text/html',
    'my-own-header': 'hello-world',
  });
  res.end('<h1>Page not found!</h1>');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
