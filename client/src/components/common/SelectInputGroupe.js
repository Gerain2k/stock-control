import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import uuid from 'uuid';

const SelectInputGroupe = ({
  label,
  options,
  name,
  value,
  onChange,
  error,
  createNewLink,
  defaultText = 'Choose...'
}) => {
  const optionsValues = options.map(option => {
    if (option.value) {
      return (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      );
    } else {
      return (
        <option defaultValue key={uuid()}>
          {defaultText}
        </option>
      );
    }
  });

  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          {label}
        </label>
      </div>
      <select
        className={classnames('custom-select ', {
          'is-invalid': error
        })}
        id="inputGroupSelect01"
        name={name}
        onChange={onChange}
        value={value}
      >
        <option defaultValue>{defaultText}</option>
        {optionsValues}
      </select>
      {createNewLink && (
        <div className="input-group-append">
          <Link className="btn btn-outline-secondary" to={createNewLink}>
            <i className="fas fa-plus-circle" />
          </Link>
        </div>
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectInputGroupe.propTypes = {
  label: PropTypes.string.isRequired,
  defaultText: PropTypes.string,
  error: PropTypes.string
};

export default SelectInputGroupe;
