const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

// Get pool connection
const pool = require('../../config/mysql');

// Get Validator
const validateProductInput = require('../../validation/product');

// @route   GET /api/test
// @desc    GET test route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Product Works' }));

// @route   GET /api/product
// @desc    GET all products
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT barcode, description, notes, productID FROM product ORDER BY Barcode ASC',
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ products: results });
        }
      }
    );
  });
});

// @route   GET /api/product
// @desc    GET product by :id
// @access  Public
router.get('/id/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT product.productID, product.description, product.barcode, product.notes FROM product WHERE ProductID=? ORDER BY description ASC',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ product: results[0] });
        }
      }
    );
  });
});

// @route   GET /api/product/:name
// @desc    GET products by :name
// @access  Public
router.get('/name/:name', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT product.productID, product.description, product.barcode, product.notes FROM product WHERE Description LIKE ? ORDER BY description ASC',
      ['%' + req.params.name + '%'],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ products: results });
        }
      }
    );
  });
});

// @route   GET /api/product/:name
// @desc    GET products by :name
// @access  Public
router.get('/barcode/:barcode', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT product.productID, product.description, product.barcode, product.notes FROM product WHERE barcode LIKE ? ORDER BY barcode ASC',
      ['%' + req.params.barcode + '%'],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ products: results });
        }
      }
    );
  });
});

// @route   POST /api/product
// @desc    POST Create new product
// @access  Public
router.post('/', (req, res) => {
  const { errors, isValid } = validateProductInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    const productID = uuidv4();
    connection.query(
      'INSERT INTO product(ProductID, Description, Barcode, Notes) VALUES (?,?,?,?)',
      [productID, req.body.description, req.body.barcode, req.body.notes],
      (error, results, fields) => {
        connection.release();
        if (error && error.errno === 1062) {
          errors.barcode = 'This barcode is already in use';
          res.status(400).json({ errors });
        } else if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          let { body } = req;
          body.productID = productID;
          res.status(200).json({ product: body });
        }
      }
    );
  });
});

// @route   PUT /api/product/:id
// @desc    PUT Update product by :id
// @access  Public
router.put('/id/:id', (req, res) => {
  const { errors, isValid } = validateProductInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'UPDATE product SET Description=?,Barcode=?,Notes=? WHERE ProductID=?',
      [req.body.description, req.body.barcode, req.body.notes, req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          let product = req.body;
          product.productID = req.params.id;
          res.status(200).json({ product });
        }
      }
    );
  });
});

// @route   DELETE /api/product/:id
// @desc    DELETE Delete product by :id
// @access  Public
router.delete('/id/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'DELETE FROM product WHERE ProductID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({
            sqlMessage:
              results.affectedRows === 1
                ? `Product with id:'${req.params.id}' had been deleted`
                : `Numbber of records deleted: ${results.affectedRows}`
          });
        }
      }
    );
  });
});

module.exports = router;
