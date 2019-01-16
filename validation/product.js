const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateProductInput = data => {
  let errors = {};
  data.description = !isEmpty(data.description) ? data.description : '';
  data.barcode = !isEmpty(data.barcode) ? data.barcode : '';

  if (!Validator.isLength(data.description, { min: 3, max: 250 })) {
    errors.description =
      'Product description must be between 3 and 250 characters';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Product description is required';
  }

  if (!Validator.isInt(data.barcode.toString())) {
    errors.barcode = 'Product barcode must be an integer';
  }

  if (Validator.isEmpty(data.barcode.toString())) {
    errors.barcode = 'Product barcode is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateProductInput;
