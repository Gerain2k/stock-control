const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const isEmpty = require('../../validation/is-empty');

// Get pool connection
const pool = require('../../config/mysql');

// Load Validator
const validateSupplierInput = require('../../validation/supplier');

// @route   GET api/suppliers/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Suppliers Works' }));

// @route   GET api/suppliers/
// @desc    Get all suppliers
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query('SELECT * FROM supplier', (error, results, fields) => {
      connection.release();
      if (error) {
        res.status(400).json({ sqlerror: error.sqlMessage });
      } else {
        res.status(200).json({ suppliers: results });
      }
    });
  });
});

// @route   GET api/suppliers/:id
// @desc    Get all supplier by :id
// @access  Public
router.get('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT supplier.*, address.addressLine1, address.addressLine2, address.city, address.country, address.postCode, bankdetails.bankName, bankdetails.accountName, bankdetails.iban, bankdetails.swiftCode FROM supplier INNER JOIN address ON supplier.addressID = address.addressID INNER JOIN bankdetails ON supplier.bankDetailsID = bankdetails.BankDetailsID WHERE supplier.supplierID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ supplier: results[0] });
        }
      }
    );
  });
});

// @route   GET api/suppliers/name/:name
// @desc    Get all supplier by :name
// @access  Public
router.get('/name/:name', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT * FROM `supplier` WHERE companyName LIKE ?',
      ['%' + req.params.name + '%'],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ suppliers: results });
        }
      }
    );
  });
});

// @route   POST api/suppliers/
// @desc    Create supplier
// @access  Public TODO: should be private
router.post('/', (req, res) => {
  const { errors, isValid } = validateSupplierInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    supplierID = uuidv4();
    connection.query(
      'INSERT INTO supplier (supplierID, companyName, phoneNumber, companyRegNr, notes, bankDetailsID, addressID) VALUES (?,?,?,?,?,?,?)',
      [
        supplierID,
        req.body.companyName,
        (req.body.phoneNumber = !isEmpty(req.body.phoneNumber)
          ? req.body.phoneNumber
          : null),
        req.body.companyRegNr,
        (req.body.notes = !isEmpty(req.body.notes) ? req.body.notes : null),
        req.body.bankDetailsID,
        req.body.addressID
      ],
      (error, results, fields) => {
        if (error) {
          connection.release();
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          connection.query(
            'SELECT * FROM supplier WHERE SupplierID=?',
            [supplierID],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ supplier: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   PUT api/suppliers/:id
// @desc    Update supplier
// @access  Public TODO: should be private
router.put('/:id', (req, res) => {
  const { errors, isValid } = validateSupplierInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'UPDATE supplier SET companyName=?, phoneNumber=?, companyRegNr=?, notes=?, bankDetailsID=?, addressID=? WHERE supplierID=?',
      [
        req.body.companyName,
        (req.body.phoneNumber = !isEmpty(req.body.phoneNumber)
          ? req.body.phoneNumber
          : null),
        req.body.companyRegNr,
        (req.body.notes = !isEmpty(req.body.notes) ? req.body.notes : null),
        req.body.bankDetailsID,
        req.body.addressID,
        req.params.id
      ],
      (error, results, fields) => {
        if (error) {
          connection.release();
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          connection.query(
            'SELECT * FROM supplier WHERE supplierID=?',
            [req.params.id],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ supplier: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   DELETE api/suppliers/:id
// @desc    DELETE supplier
// @access  Public TODO: should be private
router.delete('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'DELETE FROM supplier WHERE supplierID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({
            sqlMessage:
              results.affectedRows === 1
                ? `Supplier with id:'${req.params.id}' had been deleted`
                : `Numbber of records deleted: ${results.affectedRows}`
          });
        }
      }
    );
  });
});

module.exports = router;
