const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Get pool connection
// const pool = require('./config/mysql');

// Routes
const suppliers = require('./routes/api/suppliers');
const addressess = require('./routes/api/address');
const bankDetails = require('./routes/api/bankDetails');
const employee = require('./routes/api/employee');
const product = require('./routes/api/product');
const shop = require('./routes/api/shop');
const invoice = require('./routes/api/invoice');
const invoiceItems = require('./routes/api/invoiceItem');
const stock = require('./routes/api/stock');

// Body parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/suppliers', suppliers);
app.use('/api/addresses', addressess);
app.use('/api/bankdetails', bankDetails);
app.use('/api/employee', employee);
app.use('/api/product', product);
app.use('/api/shop', shop);
app.use('/api/invoice', invoice);
app.use('/api/invoiceitem', invoiceItems);
app.use('/api/stock', stock);

app.get('/', function(req, res) {
  res.send('Hello World');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
