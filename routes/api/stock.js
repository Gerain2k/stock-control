const express = require('express');
const router = express.Router();

// Get pool connection
const pool = require('../../config/mysql');

// Get Validator
const validateStockInput = require('../../validation/stock');

// @route   GET api/stock/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Stock Works' }));

// @route   POST /api/stock/
// @desc    POST Insert or update stock
// @access  Public
router.post('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'INSERT INTO stock( ShopID, ProductID, Quantity, PricePerUnit) VALUES ? ON DUPLICATE KEY UPDATE Quantity=Quantity+VALUES(Quantity), PricePerUnit=GREATEST(PricePerUnit, VALUES(PricePerUnit))',
      [req.body.stockItems],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res
            .status(200)
            .json({ msg: `${results.affectedRows} records saved.` });
        }
      }
    );
  });
});

// @route   GET /api/stock/shop/:id
// @desc    GET stock by shop id
// @access  Public
router.get('/shop/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT * FROM stock LEFT JOIN product ON stock.ProductID = product.ProductID WHERE ShopID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ stock: results });
        }
      }
    );
  });
});

module.exports = router;
