import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';

const AlertBox = ({ type, text }) => {
  let alertType = `alert alert-${type}`;
  let alertText = text.map(item => <p key={uniqid()}>{item}</p>);
  return (
    <div className={alertType} role="alert">
      {alertText}
    </div>
  );
};

AlertBox.prototype = {
  type: PropTypes.string,
  text: PropTypes.array
};

export default AlertBox;
