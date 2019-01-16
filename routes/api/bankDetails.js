const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const isEmpty = require('../../validation/is-empty');

// Get pool connection
const pool = require('../../config/mysql');

// Load Validator
const validateBankDetailsInput = require('../../validation/bankDetails');

// @route   GET api/bankdetails/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Bank details works' }));

// @route   GET api/bankdetails/
// @desc    Get all bank details
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query('SELECT * FROM bankdetails', (error, results, fields) => {
      connection.release();
      if (error) {
        res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
      } else {
        res.status(200).json({ bankDetails: results });
      }
    });
  });
});

// @route   GET api/bankdetails/:id
// @desc    Get bank details by :id
// @access  Public
router.get('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query(
      'SELECT * FROM bankdetails WHERE bankDetailsID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
        } else {
          res.status(200).json({ bankDetails: results });
        }
      }
    );
  });
});

// @route   POST api/bankdetails/
// @desc    Create bank details
// @access  Public
router.post('/', (req, res) => {
  const { errors, isValid } = validateBankDetailsInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    bankID = uuidv4();
    connection.query(
      'INSERT INTO bankdetails(bankDetailsID, bankName, accountName, iban, swiftCode) VALUES (?,?,?,?,?)',
      [
        bankID,
        req.body.bankName,
        req.body.accountName,
        req.body.iban,
        req.body.swiftCode
      ],
      (error, results, fields) => {
        // When done with the connection, release it.
        if (error) {
          if (error.errno === 1062) {
            // Get dublicare and use it's ID
            connection.query(
              'SELECT * FROM bankdetails WHERE iban=?',
              [req.body.iban],
              (error, results, fields) => {
                connection.release();
                res.status(200).json({ bankDetails: results[0] });
              }
            );
          } else {
            connection.release();
            res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
          }
        } else {
          connection.query(
            'SELECT * FROM bankdetails WHERE bankDetailsID=?',
            [bankID],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ bankDetails: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   PUT api/bankdetails/:id
// @desc    Update bank details by :id
// @access  Public
router.put('/:id', (req, res) => {
  const { errors, isValid } = validateBankDetailsInput(req.body);
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
      'UPDATE bankdetails SET bankName=?,accountName=?,iban=?,swiftCode=? WHERE bankDetailsID=?',
      [
        req.body.bankName,
        req.body.accountName,
        req.body.iban,
        req.body.swiftCode,
        req.params.id
      ],
      (error, results, fields) => {
        // When done with the connection, release it.
        if (error) {
          connection.release();
          res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
        } else {
          connection.query(
            'SELECT * FROM bankdetails WHERE bankDetailsID=?',
            [req.params.id],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ bankDetails: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   DELETE api/bankdetails/:id
// @desc    Delete bank details by :id
// @access  Public
router.delete('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(400)
        .json({ errors: { sqlerror: 'Can not connect to database' } });
    } // not connected!
    connection.query(
      'DELETE FROM bankdetails WHERE bankDetailsID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ errors: { sqlerror: error.sqlMessage } });
        } else {
          res.status(200).json({
            sqlMessage:
              results.affectedRows === 1
                ? `Bank details with id:'${req.params.id}' had been deleted`
                : `Numbber of records deleted: ${results.affectedRows}`
          });
        }
      }
    );
  });
});

module.exports = router;
