const express = require('express');
const router = express.Router();

// Get pool connection
const pool = require('../../config/mysql');

// Get Validator
const validateInvoiceInput = require('../../validation/invoice');

// @route   GET api/invoice/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Invoice Works' }));

// @route   GET /api/invoice/
// @desc    GET All invoices
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT invoice.invoiceID,invoice.invoiceNumber, invoice.date, invoice.paymentDueDate, invoice.payed, b.total,b.itemTotal, e.employeeID, e.name, e.surname, s.shopID, s.shopName, sup.supplierID, sup.companyName FROM invoice INNER JOIN (SELECT InvoiceID, FORMAT(SUM(Quantity * PricePerUnit),2) AS total, SUM(Quantity) AS itemTotal FROM invoiceitems GROUP BY invoiceitems.InvoiceID ) AS b ON invoice.InvoiceID = b.InvoiceID INNER JOIN employee AS e ON invoice.EmployeeID = e.EmployeeID INNER JOIN shop AS s ON invoice.ShopID = s.ShopID INNER JOIN supplier as sup ON invoice.SupplierID = sup.SupplierID',
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ invoices: results });
        }
      }
    );
  });
});

// @route   GET /api/invoice/filter
// @desc    GET Get invoices with filter presets
// @access  Public
router.post('/filter', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    const { filters } = req.body;
    connection.query(
      'SELECT invoice.invoiceID,invoice.invoiceNumber, invoice.date, invoice.paymentDueDate, invoice.payed, b.total,b.itemTotal, e.employeeID, e.name, e.surname, s.shopID, s.shopName, sup.supplierID, sup.companyName FROM invoice INNER JOIN (SELECT InvoiceID, FORMAT(SUM(Quantity* PricePerUnit),2) AS total, SUM(Quantity) AS itemTotal FROM invoiceitems GROUP BY invoiceitems.InvoiceID ) AS b ON invoice.InvoiceID = b.InvoiceID INNER JOIN employee AS e ON invoice.EmployeeID = e.EmployeeID INNER JOIN shop AS s ON invoice.ShopID = s.ShopID INNER JOIN supplier as sup ON invoice.SupplierID = sup.SupplierID WHERE invoice.Date <= ? AND invoice.Date >= ? AND invoice.EmployeeID LIKE ? AND invoice.ShopID LIKE ? AND invoice.SupplierID LIKE ? AND invoice.Payed <= ?',
      [
        filters.dateTo,
        filters.dateFrom,
        '%' + filters.employee,
        '%' + filters.shop,
        '%' + filters.supplier,
        filters.notPayed ? 0 : 1
      ],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ invoices: results });
        }
      }
    );
  });
});

// @route   GET /api/invoice/id/:id
// @desc    GET Get invoice by id
// @access  Public
router.get('/id/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT invoiceID, invoiceNumber, date, supplierID, employeeID, shopID, paymentDueDate, payed FROM invoice WHERE invoiceID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ invoice: results[0] });
        }
      }
    );
  });
});

// @route   POST /api/invoice
// @desc    POST Create new invoice
// @access  Public
router.post('/', (req, res) => {
  const { errors, isValid } = validateInvoiceInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'INSERT INTO invoice(InvoiceID, InvoiceNumber, Date, SupplierID, EmployeeID, ShopID, PaymentDueDate) VALUES (?,?,?,?,?,?,?)',
      [
        req.body.invoiceID,
        req.body.invoiceNumber,
        req.body.date,
        req.body.supplierID,
        req.body.employeeID,
        req.body.shopID,
        req.body.paymentDueDate
      ],
      (error, results, fields) => {
        if (error) {
          connection.release();
        } else {
          let { body } = req;
          res.status(200).json({ product: body });
        }
      }
    );
  });
});

module.exports = router;
