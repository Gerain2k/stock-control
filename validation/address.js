const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateAddressInput = data => {
  let errors = {};
  data.addressLine1 = !isEmpty(data.addressLine1) ? data.addressLine1 : '';
  data.addressLine2 = !isEmpty(data.addressLine2) ? data.addressLine2 : '';
  data.city = !isEmpty(data.city) ? data.city : '';
  data.country = !isEmpty(data.country) ? data.country : '';
  data.postCode = !isEmpty(data.postCode) ? data.postCode : '';

  if (!Validator.isLength(data.addressLine1, { min: 1, max: 150 })) {
    errors.addressLine1 = 'Address Line 1 must be between 1 and 150 characters';
  }

  if (Validator.isEmpty(data.addressLine1)) {
    errors.addressLine1 = 'Address Line 1 is required';
  }

  if (!Validator.isLength(data.addressLine2, { min: 0, max: 150 })) {
    errors.addressLine2 =
      'Address Line 2 should not be longer then 150 charactes';
  }

  if (!Validator.isLength(data.city, { min: 1, max: 50 })) {
    errors.city = 'City must be between 1 and 50 characters';
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = 'City is required';
  }

  if (!Validator.isLength(data.country, { min: 1, max: 50 })) {
    errors.country = 'Country must be between 1 and 50 characters';
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = 'Country is required';
  }

  if (!Validator.isLength(data.postCode, { min: 1, max: 40 })) {
    errors.postCode = 'Post code must be between 1 and 40 characters';
  }

  if (Validator.isEmpty(data.postCode)) {
    errors.postCode = 'Post code is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateAddressInput;
