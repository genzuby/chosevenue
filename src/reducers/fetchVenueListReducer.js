import { FETCH_VENUE_LIST } from "../action/staticInfo";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_VENUE_LIST:
      return action.payload;
    default:
      return state;
  }
};
