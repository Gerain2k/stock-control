import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import addressReducer from './addressReducer';
import bankDetailsReducer from './bankDetailsReducer';
import supplierReducer from './supplierReducer';
import suppliersReducer from './suppliersReducer';

export default combineReducers({
  address: addressReducer,
  errors: errorReducer,
  bankDetails: bankDetailsReducer,
  supplier: supplierReducer,
  suppliers: suppliersReducer
});
