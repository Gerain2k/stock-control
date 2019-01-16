import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

const IconButton = ({
  linkTo,
  additionalClasses,
  iconSize,
  iconName,
  buttonText
}) => {
  return (
    <Link
      to={linkTo}
      className={classnames('btn btn-icon btn-lg btn-light', additionalClasses)}
    >
      <i className={classnames(iconSize, iconName)} />
      <br /> {buttonText}
    </Link>
  );
};

IconButton.propTypes = {
  linkTo: PropTypes.string.isRequired,
  additionalClasses: PropTypes.string,
  iconSize: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  buttonText: PropTypes.string
};

export default IconButton;
