import React from 'react';
import PropTypes from 'prop-types';

const TextAreaGroup = ({ name, placeholder, value, onChange }) => {
  return (
    <div className="form-group">
      <textarea
        className="form-control form-control-lg plr-4"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

TextAreaGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TextAreaGroup;
