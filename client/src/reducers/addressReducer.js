import { GET_ADDRESS } from '../actions/types';
const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ADDRESS:
      return {
        ...state,
        ...action.payload.address
      };
    default:
      return state;
  }
}
