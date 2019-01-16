const Validator = require('validator');
const isEmpty = require('./is-empty');
const moment = require('moment');

const validateAddressInput = (data, ignorePassword = false) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.surname = !isEmpty(data.surname) ? data.surname : '';
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : '';
  data.addressID = !isEmpty(data.addressID) ? data.addressID : '';
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';
  data.bankDetailsID = !isEmpty(data.bankDetailsID) ? data.bankDetailsID : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';
  data.email = !isEmpty(data.email) ? data.email : '';

  if (!Validator.isLength(data.name, { min: 1, max: 50 })) {
    errors.name = 'Employee name must be between 1 and 50 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Employee name is required';
  }

  if (!Validator.isLength(data.surname, { min: 1, max: 50 })) {
    errors.surname = 'Employee surname must be between 1 and 50 characters';
  }

  if (Validator.isEmpty(data.surname)) {
    errors.surname = 'Employee surname is required';
  }

  const date = moment(new Date(data.dateOfBirth));
  if (!date.isValid()) {
    errors.dateOfBirth = 'Date of birth is incorect it should be YYYY-MM-DD';
  }

  if (Validator.isEmpty(data.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required';
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

  if (!Validator.isLength(data.phoneNumber, { min: 5, max: 50 })) {
    errors.phoneNumber = 'Phone number must be between 5 and 50 characters';
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'Phone number is required';
  }

  if (ignorePassword && Validator.isLength(data.password, { min: 1 })) {
    if (!Validator.isLength(data.password, { min: 6, max: 40 })) {
      errors.password = 'Employee password must be between 6 and 40 characters';
    }
  }

  if (
    !ignorePassword &&
    !Validator.isLength(data.password, { min: 6, max: 40 })
  ) {
    errors.password = 'Employee password must be between 6 and 40 characters';
  }

  if (!ignorePassword && Validator.isEmpty(data.password)) {
    errors.password = 'Employee password is required';
  }

  if (data.password !== data.confirmPassword) {
    errors.password = 'Passwords should match';
    errors.confirmPassword = 'Passwords should match';
  }

  if (!ignorePassword && Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Password confirmation is required';
  }

  if (!Validator.isLength(data.email, { min: 3, max: 100 })) {
    errors.email = 'Employee email must be between 3 and 100 characters';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Employee email is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateAddressInput;
