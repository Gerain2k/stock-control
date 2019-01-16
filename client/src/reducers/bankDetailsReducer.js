import { GET_BANKDETAILS } from '../actions/types';
const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_BANKDETAILS:
      return {
        ...state,
        ...action.payload.bankDetails
      };
    default:
      return state;
  }
}
