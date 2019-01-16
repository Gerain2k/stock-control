const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateBankDetailsInput = data => {
  let errors = {};
  data.bankName = !isEmpty(data.bankName) ? data.bankName : '';
  data.accountName = !isEmpty(data.accountName) ? data.accountName : '';
  data.iban = !isEmpty(data.iban) ? data.iban : '';
  data.swiftCode = !isEmpty(data.swiftCode) ? data.swiftCode : '';

  if (!Validator.isLength(data.bankName, { min: 1, max: 100 })) {
    errors.bankName = 'Bank name must be between 1 and 100 characters';
  }

  if (Validator.isEmpty(data.bankName)) {
    errors.bankName = 'Bank name is required';
  }

  if (!Validator.isLength(data.accountName, { min: 1, max: 100 })) {
    errors.accountName = 'Account name must be between 1 and 100 characters';
  }

  if (Validator.isEmpty(data.accountName)) {
    errors.accountName = 'Account name is required';
  }

  if (!Validator.isLength(data.iban, { min: 1, max: 100 })) {
    errors.iban = 'IBAN must be between 1 and 100 characters';
  }

  if (Validator.isEmpty(data.iban)) {
    errors.iban = 'IBAN is required';
  }

  if (!Validator.isLength(data.swiftCode, { min: 1, max: 100 })) {
    errors.swiftCode = 'Swift code must be between 1 and 100 characters';
  }

  if (Validator.isEmpty(data.swiftCode)) {
    errors.swiftCode = 'Swift code is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateBankDetailsInput;
