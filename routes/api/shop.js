const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

// Get pool connection
const pool = require('../../config/mysql');

// Get validator
const validateShopInput = require('../../validation/shop');

// @route   GET /api/shop/test
// @desc    GET Test route for shops
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Shops routes working' }));

// @route   GET /api/shop/test
// @desc    GET All shops
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query('SELECT * FROM shop', (error, results, fields) => {
      connection.release();
      if (error) {
        res.status(400).json({ sqlerror: error.sqlMessage });
      } else {
        res.status(200).json({ shops: results });
      }
    });
  });
});

// @route   GET /api/shop/id/:id
// @desc    GET Shop by :id
// @access  Public
router.get('/id/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      "SELECT S.shopID as 'shop.shopID', S.shopName as 'shop.shopName', S.addressID as 'shop.addressID', S.phoneNumber as 'shop.phoneNumber', S.notes as 'shop.notes', A.addressID as 'address.addressID', A.addressLine1 as 'address.addressLine1', A.addressLine2 as 'address.addressLine2', A.city as 'address.city', A.country as 'address.country', A.postCode as 'address.postCode' FROM shop as S INNER JOIN address as A ON S.addressID = A.addressID WHERE S.ShopID=?",
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ shop: results[0] });
        }
      }
    );
  });
});

/// @route   POST /api/shop
// @desc    POST Create new shop
// @access  Public
router.post('/', (req, res) => {
  const { errors, isValid } = validateShopInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    const shopID = uuidv4();
    connection.query(
      'INSERT INTO shop(ShopID, ShopName, AddressID, PhoneNumber, Notes) VALUES (?,?,?,?,?)',
      [
        shopID,
        req.body.shopName,
        req.body.addressID,
        req.body.phoneNumber,
        req.body.notes ? req.body.notes : ''
      ],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          let { body } = req;
          body.shopID = shopID;
          res.status(200).json({ shop: body });
        }
      }
    );
  });
});

// @route   PUT /api/shop/id/:id
// @desc    PUT Update shop by :id
// @access  Public
router.put('/id/:id', (req, res) => {
  const { errors, isValid } = validateShopInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'UPDATE shop SET ShopName=?,AddressID=?,PhoneNumber=?,Notes=? WHERE ShopID=?',
      [
        req.body.shopName,
        req.body.addressID,
        req.body.phoneNumber,
        req.body.notes ? req.body.notes : '',
        req.params.id
      ],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          let { body } = req;
          body.shopID = req.params.id;
          res.status(200).json({ shop: body });
        }
      }
    );
  });
});

// @route   DELETE /api/shop/:id
// @desc    DELETE Shop by :id
// @access  Public
router.delete('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'DELETE from shop WHERE ShopID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({
            sqlMessage:
              results.affectedRows === 1
                ? `Shop with id:'${req.params.id}' had been deleted`
                : `Numbber of records deleted: ${results.affectedRows}`
          });
        }
      }
    );
  });
});

module.exports = router;
