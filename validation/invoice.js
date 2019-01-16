const Validator = require('validator');
const isEmpty = require('./is-empty');
const moment = require('moment');

const validateInvoiceItemInput = data => {
  let errors = {};
  data.invoiceID = !isEmpty(data.invoiceID) ? data.invoiceID : '';
  data.invoiceNumber = !isEmpty(data.invoiceNumber) ? data.invoiceNumber : '';
  data.date = !isEmpty(data.date) ? data.date : '';
  data.supplierID = !isEmpty(data.supplierID) ? data.supplierID : '';
  data.employeeID = !isEmpty(data.employeeID) ? data.employeeID : '';
  data.shopID = !isEmpty(data.shopID) ? data.shopID : '';
  data.paymentDueDate = !isEmpty(data.paymentDueDate)
    ? data.paymentDueDate
    : '';

  if (!Validator.isLength(data.invoiceID, { min: 36, max: 64 })) {
    errors.invoiceID = 'Invoice ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.invoiceID)) {
    errors.invoiceID = 'Invoice ID is required';
  }

  if (!Validator.isLength(data.invoiceNumber, { min: 3, max: 50 })) {
    errors.invoiceNumber = 'Invoice Number must be between 3 and 60 characters';
  }

  if (Validator.isEmpty(data.invoiceNumber)) {
    errors.invoiceNumber = 'Invoice Number is required';
  }

  let date = moment(new Date(data.date));
  if (!date.isValid()) {
    errors.date = 'Date of birth is incorect it should be YYYY-MM-DD';
  }

  if (Validator.isEmpty(data.date)) {
    errors.date = 'Date of birth is required';
  }

  if (!Validator.isLength(data.supplierID, { min: 36, max: 64 })) {
    errors.supplierID = 'Supplier ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.supplierID)) {
    errors.supplierID = 'Supplier ID is required';
  }

  if (!Validator.isLength(data.employeeID, { min: 36, max: 64 })) {
    errors.employeeID = 'Employee ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.employeeID)) {
    errors.employeeID = 'Employee ID is required';
  }

  if (!Validator.isLength(data.shopID, { min: 36, max: 64 })) {
    errors.shopID = 'Shop ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.shopID)) {
    errors.shopID = 'Shop ID is required';
  }

  date = moment(new Date(data.paymentDueDate));
  if (!date.isValid()) {
    errors.paymentDueDate =
      'Payment due date is incorect it should be YYYY-MM-DD';
  }

  if (Validator.isEmpty(data.date)) {
    errors.paymentDueDate = 'Payment due date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateInvoiceItemInput;
