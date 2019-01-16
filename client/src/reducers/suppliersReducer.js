import { GET_ALL_SUPPLIERS } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SUPPLIERS:
      return {
        ...state,
        ...action.payload.suppliers
      };
    default:
      return state;
  }
}
