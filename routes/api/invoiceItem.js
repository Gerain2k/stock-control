const express = require('express');
const router = express.Router();

// Get pool connection
const pool = require('../../config/mysql');

// Get Validator
const validateInvoiceItemInput = require('../../validation/invoiceItem');

// @route   GET api/invoiceitem/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Invoice Item Works' }));

// @route   POST api/invoiceitem/
// @desc    Save invoice item/s
// @access  Public
router.post('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    console.log(req.body.invoiceItems);
    connection.query(
      'INSERT INTO invoiceitems(InvoiceID, ProductID, Quantity, PricePerUnit) VALUES ? ON DUPLICATE KEY UPDATE Quantity=Quantity+VALUES(Quantity)',
      [req.body.invoiceItems],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).send({ error });
        } else {
          res
            .status(200)
            .send({ msg: `${results.affectedRows} records saved.` });
        }
      }
    );
  });
});

// @route   GET /api/invoiceitem/invoice/id/:id
// @desc    GET Get all invoice items by invoice :id
// @access  Public
router.get('/invoice/id/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT invoiceID, invoiceitems.productID, quantity, pricePerUnit, barcode, description as name FROM invoiceitems INNER JOIN product ON invoiceitems.productID = product.productID WHERE InvoiceID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).send({ error });
        } else {
          res.status(200).send({ invoiceItems: results });
        }
      }
    );
  });
});

module.exports = router;
