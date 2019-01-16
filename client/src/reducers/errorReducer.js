import {
  GET_ERRORS_ADDRESS,
  TEST_DISPATCH,
  GET_ERRORS_BANK_DETAILS,
  GET_ERROTS_SUPPLIER
} from '../actions/types';

const initialState = {
  address: {},
  bankDetails: {},
  supplier: {}
};

export default function(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case TEST_DISPATCH:
      return {
        data: action.payload
      };
    case GET_ERRORS_ADDRESS:
      newState.address = action.payload.errors;
      return {
        ...newState
      };
    case GET_ERRORS_BANK_DETAILS:
      newState.bankDetails = action.payload.errors;
      return {
        ...newState
      };
    case GET_ERROTS_SUPPLIER:
      newState.supplier = action.payload.errors;
      return {
        ...newState
      };
    default:
      return state;
  }
}
