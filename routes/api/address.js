const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const isEmpty = require('../../validation/is-empty');

// Get pool connection
const pool = require('../../config/mysql');

// Load Validator
const validateAddressInput = require('../../validation/address');

// @route   GET api/addresses/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Addresses Works' }));

// @route   GET api/addresses/
// @desc    Get all addresses
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query('SELECT * FROM address', (error, results, fields) => {
      connection.release();

      if (error) {
        res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
      } else {
        res.status(200).json({ addresses: results });
      }
    });
  });
});

// @route   GET api/addresses/:id
// @desc    Get one addresses
// @access  Public
router.get('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query(
      'SELECT * FROM address WHERE addressID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();

        if (error) {
          res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
        } else {
          res.status(200).json({ addresses: results });
        }
      }
    );
  });
});

// @route   POST api/addresses/
// @desc    Create address
// @access  Public TODO: should be private
router.post('/', (req, res) => {
  const { errors, isValid } = validateAddressInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    addressID = uuidv4();
    connection.query(
      'INSERT INTO address(addressID, addressLine1, addressLine2, city, country, postCode) VALUES (?,?,?,?,?,?)',
      [
        addressID,
        req.body.addressLine1,
        (req.body.addressLine2 = !isEmpty(req.body.addressLine2)
          ? req.body.addressLine2
          : null),
        req.body.city,
        req.body.country,
        req.body.postCode
      ],
      (error, results, fields) => {
        // When done with the connection, release it.

        if (error) {
          if (error.errno === 1062) {
            // Get dublicare and use it's ID
            connection.query(
              'SELECT * FROM address WHERE addressLine1=? AND postCode=?',
              [req.body.addressLine1, req.body.postCode],
              (error, results, fields) => {
                connection.release();
                res.status(200).json({ address: results[0] });
              }
            );
          } else {
            // console.log(error);
            connection.release();
            res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
          }
        } else {
          connection.query(
            'SELECT * FROM address WHERE addressID=?',
            [addressID],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ address: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   PUT api/addresses/
// @desc    Update address
// @access  Public TODO: should be private
router.put('/:id', (req, res) => {
  const { errors, isValid } = validateAddressInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query(
      'UPDATE address SET addressLine1=?, addressLine2=?, city=?, country=?, postCode=? WHERE address.addressID = ?',
      [
        req.body.addressLine1,
        (req.body.addressLine2 = !isEmpty(req.body.addressLine2)
          ? req.body.addressLine2
          : null),
        req.body.city,
        req.body.country,
        req.body.postCode,
        req.params.id
      ],
      function(error, results, fields) {
        if (error) {
          connection.release();
          res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
        } else {
          connection.query(
            'SELECT * FROM address WHERE addressID=?',
            [req.params.id],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ address: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   DELETE api/addresses/:id
// @desc    Delete Address
// @access  Public
router.delete('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query(
      'DELETE FROM address WHERE AddressID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        // console.log(results);
        if (error) {
          res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
        } else {
          res.status(200).json({
            sqlMessage:
              results.affectedRows === 1
                ? `Address with id:${req.params.id} had been deleted`
                : `Numbber of records deleted: ${results.affectedRows}`
          });
        }
      }
    );
  });
});

module.exports = router;
