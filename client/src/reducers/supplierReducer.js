import { ADD_SUPPLIER } from '../actions/types';
const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_SUPPLIER:
      return {
        ...state,
        ...action.payload.supplier
      };
    default:
      return state;
  }
}
