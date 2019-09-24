import { ADD_PARTICIPANT } from "../action/staticInfo";

export default (state = [], action) => {
  switch (action.type) {
    case ADD_PARTICIPANT:
      // to use dynamic key value (group id and venue id), check key validation
      if (!state.hasOwnProperty(action.payload.groupId)) {
        // totally new
        return {
          ...state,
          [action.payload.groupId]: {
            [action.payload.venueId]: [action.payload.voter]
          }
        };
      } else if (
        state.hasOwnProperty(action.payload.groupId) &&
        !state[action.payload.groupId].hasOwnProperty(action.payload.venueId)
      ) {
        // when group id exist but no venue id
        return {
          ...state, // copy state
          [action.payload.groupId]: {
            ...state[action.payload.groupId], // copy venue info
            [action.payload.venueId]: [action.payload.voter]
          }
        };
      } else {
        return {
          // when group id  and venue id exist,
          ...state, // copy state
          [action.payload.groupId]: {
            ...state[action.payload.groupId], // copy venue info
            [action.payload.venueId]: [
              ...state[action.payload.groupId][action.payload.venueId], // copy user name
              action.payload.voter
            ]
          }
        };
      }

    default:
      return state;
  }
};
