import { GET_ERROTS_SUPPLIER, GET_ALL_SUPPLIERS } from './types';
import axios from 'axios';

export const createSupplier = (supplierData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    console.log(supplierData);
    axios
      .post('/api/suppliers/', supplierData)
      .then(res => {
        history.push('/suppliers');
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERROTS_SUPPLIER,
          payload: err.response.data
        });
        reject();
      });
  });
};

export const getAllSuppliers = () => dispatch => {
  axios.get('/api/suppliers/').then(res => {
    dispatch({
      type: GET_ALL_SUPPLIERS,
      payload: res.data
    });
  });
};
