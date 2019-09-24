import { combineReducers } from "redux";
import fetchVenueListReducer from "./fetchVenueListReducer";
import addParticipantReducer from "./addParticipantReducer";

export default combineReducers({
  venueList: fetchVenueListReducer,
  voters: addParticipantReducer
});
