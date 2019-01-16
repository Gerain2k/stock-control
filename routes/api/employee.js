const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

// Get pool connection
const pool = require('../../config/mysql');

// Get Validator
const validateEmployeeInput = require('../../validation/employee');

// @route   GET api/employee/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Employee Works' }));

// @route   GET api/employee/
// @desc    All employees
// @access  Public
router.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'SELECT * FROM employee ORDER BY Surname DESC, Name DESC',
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ employees: results });
        }
      }
    );
  });
});

// @route   GET api/employee/:id
// @desc    Get one employee by id
// @access  Public
router.get('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      "SELECT employee.employeeID as 'employee.employeeID', employee.name as 'employee.name', employee.surname as 'employee.surname', employee.dateOfBirth as 'employee.dateOfBirth', employee.addressID as 'employee.addressID', employee.phoneNumber as 'employee.phoneNumber', employee.bankDetailsID 'employee.bankDetailsID', employee.email as 'employee.email', address.addressID as 'address.addressID', address.addressLine1 as 'address.addressLine1', address.addressLine2 as 'address.addressLine2', address.city as 'address.city', address.country as 'address.country', address.postCode as 'address.postCode', bankdetails.bankDetailsID as 'bankdetails.bankDetailsID', bankdetails.bankName as 'bankdetails.bankName', bankdetails.accountName as 'bankdetails.accountName', bankdetails.iban as 'bankdetails.iban', bankdetails.swiftCode as 'bankdetails.swiftCode'  FROM employee INNER JOIN address ON employee.AddressID = address.addressID INNER JOIN bankdetails ON employee.BankDetailsID = bankdetails.bankDetailsID WHERE EmployeeID=?",
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ employee: results[0] });
        }
      }
    );
  });
});

// @route   PUT /api/employee/:id
// @desc    PUT update employee by :id
// @access  Public
router.put('/:id', (req, res) => {
  const { errors, isValid } = validateEmployeeInput(req.body, true);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'UPDATE employee SET Name=?,Surname=?,DateOfBirth=?,AddressID=?,PhoneNumber=?,BankDetailsID=?,Email=? WHERE EmployeeID=?',
      [
        req.body.name,
        req.body.surname,
        req.body.dateOfBirth,
        req.body.addressID,
        req.body.phoneNumber,
        req.body.bankDetailsID,
        req.body.email,
        req.params.id
      ],
      (error, results, fields) => {
        if (error) {
          connection.release();
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({ message: 'Employee saved succesfully' });
          connection.release();
        }
      }
    );
  });
});

// @route   POST api/employee/
// @desc    Create employee
// @access  Public
router.post('/', (req, res) => {
  const { errors, isValid } = validateEmployeeInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    const employeeID = uuidv4();
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    connection.query(
      'INSERT INTO employee (EmployeeID, Name, Surname, DateOfBirth, AddressID, PhoneNumber, BankDetailsID, Password, Email) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        employeeID,
        req.body.name,
        req.body.surname,
        req.body.dateOfBirth,
        req.body.addressID,
        req.body.phoneNumber,
        req.body.bankDetailsID,
        hashPassword,
        req.body.email
      ],
      (error, results, fields) => {
        if (error) {
          connection.release();
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          connection.query(
            'SELECT * FROM employee WHERE EmployeeID=?',
            [employeeID],
            (error, results, fields) => {
              connection.release();
              res.status(200).json({ employee: results[0] });
            }
          );
        }
      }
    );
  });
});

// @route   DELETE /api/employee/:id
// @desc    DELETE Employee by :id
// @access  Public
router.delete('/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(400).json({ sqlerror: 'Can not connect to database' });
    } // not connected!
    connection.query(
      'DELETE FROM employee WHERE EmployeeID=?',
      [req.params.id],
      (error, results, fields) => {
        connection.release();
        if (error) {
          res.status(400).json({ sqlerror: error.sqlMessage });
        } else {
          res.status(200).json({
            sqlMessage:
              results.affectedRows === 1
                ? `Employee with id:'${req.params.id}' had been deleted`
                : `Numbber of records deleted: ${results.affectedRows}`
          });
        }
      }
    );
  });
});

module.exports = router;
