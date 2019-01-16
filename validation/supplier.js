const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateSupplierInput = data => {
  let errors = {};
  data.companyName = !isEmpty(data.companyName) ? data.companyName : '';
  data.companyRegNr = !isEmpty(data.companyRegNr) ? data.companyRegNr : '';
  data.bankDetailsID = !isEmpty(data.bankDetailsID) ? data.bankDetailsID : '';
  data.addressID = !isEmpty(data.addressID) ? data.addressID : '';

  if (!Validator.isLength(data.companyName, { min: 1, max: 100 })) {
    errors.companyName = 'Company Name must be between 1 and 100 characters';
  }

  if (Validator.isEmpty(data.companyName)) {
    errors.companyName = 'Company Name is required';
  }

  if (!Validator.isLength(data.companyRegNr, { min: 1, max: 100 })) {
    errors.companyRegNr =
      'Company Registration number must be between 1 and 100 characters';
  }

  if (Validator.isEmpty(data.companyRegNr)) {
    errors.companyRegNr = 'Company Registration number is required';
  }

  if (!Validator.isLength(data.bankDetailsID, { min: 36, max: 64 })) {
    errors.bankDetailsID = 'Bank ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.bankDetailsID)) {
    errors.bankDetailsID = 'Bank ID is required';
  }

  if (!Validator.isLength(data.addressID, { min: 36, max: 64 })) {
    errors.addressID = 'Address ID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.addressID)) {
    errors.addressID = 'Address ID is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateSupplierInput;
