const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateShopInput = data => {
  let errors = {};
  data.shopName = !isEmpty(data.shopName) ? data.shopName : '';
  data.addressID = !isEmpty(data.addressID) ? data.addressID : '';
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';

  if (!Validator.isLength(data.shopName, { min: 1, max: 50 })) {
    errors.shopName = 'Shop name must be between 1 and 50 characters';
  }

  if (Validator.isEmpty(data.shopName)) {
    errors.shopName = 'Shop name is required';
  }

  if (!Validator.isLength(data.addressID, { min: 36, max: 64 })) {
    errors.addressID = 'Shop addressID must be between 36 and 64 characters';
  }

  if (Validator.isEmpty(data.addressID)) {
    errors.addressID = 'Shop addressID is required';
  }

  if (!Validator.isLength(data.phoneNumber, { min: 5, max: 50 })) {
    errors.phoneNumber =
      'Shop phone number must be between 5 and 50 characters';
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'Shop phone number is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateShopInput;
