const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateInvoiceItemInput = data => {
  let errors = {};
  data.invoiceID = !isEmpty(data.invoiceID) ? data.invoiceID : '';
  data.productID = !isEmpty(data.productID) ? data.productID : '';
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.pricePerUnit = !isEmpty(data.pricePerUnit) ? data.pricePerUnit : '';

  if (!Validator.isLength(data.invoiceID, { min: 36, max: 64 })) {
    errors.invoiceID = 'Invoice ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.invoiceID)) {
    errors.invoiceID = 'Invoice ID is required';
  }

  if (!Validator.isLength(data.productID, { min: 36, max: 64 })) {
    errors.productID = 'Product ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.productID)) {
    errors.productID = 'Product ID is required';
  }

  if (!Validator.isInt(data.quantity)) {
    errors.quantity = 'Product quantity must be an integer';
  }

  if (data.quantity <= 0) {
    errors.quantity = 'Product quantity must be > 0';
  }

  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = 'Product quantity is required';
  }

  if (!Validator.isNumeric(data.pricePerUnit)) {
    errors.pricePerUnit = 'Product price per unit must be a number';
  }

  if (data.pricePerUnit <= 0) {
    errors.pricePerUnit = 'Product price per unit must be > 0';
  }

  if (Validator.isEmpty(data.pricePerUnit)) {
    errors.pricePerUnit = 'Product price per unit is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateInvoiceItemInput;
