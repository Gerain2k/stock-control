import {
  GET_ERRORS_ADDRESS,
  GET_ERRORS_BANK_DETAILS,
  GET_ADDRESS,
  GET_BANKDETAILS
} from './types';
import axios from 'axios';

export const createNewAddress = address => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/addresses/', address)
      .then(res => {
        dispatch({
          type: GET_ADDRESS,
          payload: res.data
        });
        dispatch({
          type: GET_ERRORS_ADDRESS,
          payload: {}
        });
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS_ADDRESS,
          payload: err.response.data
        });
        reject();
      });
  });
};

export const createNewBankDetails = bankDetails => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/bankdetails/', bankDetails)
      .then(res => {
        dispatch({
          type: GET_BANKDETAILS,
          payload: res.data
        });
        dispatch({
          type: GET_ERRORS_BANK_DETAILS,
          payload: {}
        });
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS_BANK_DETAILS,
          payload: err.response.data
        });
        reject();
      });
  });
};
