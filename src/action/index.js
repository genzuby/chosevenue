import {
  FS_CLIENT_ID,
  FS_CLIENT_SECRET,
  FETCH_VENUE_LIST,
  ADD_PARTICIPANT
} from "./staticInfo";
import foursquareApi from "../apis/foursquareApi";

// fetch veneu list from fouraquare API. param will be passed by component with the location information that choosed by user
export const getVenueList = param => async dispatch => {
  try {
    // fetch data
    const response = await foursquareApi.get(
      `/search/?client_id=${FS_CLIENT_ID}&client_secret=${FS_CLIENT_SECRET}&query=lunch,restaurant,cafe&${param}&v=20190724&limit=3`
    );

    // if the request has been successfully done, will dispatch data for a reducer.
    if (response.data.response) {
      // Informaton for no result
      if (response.data.response.venues.length === 0) {
        alert("There is no data the area that you selected.");
        return;
      }

      // merge each veneu's detail information as one object
      const venueArray = await getVenueDetail(response.data.response.venues);

      // keep groupid to vote for the venues near the location
      const groupId = response.data.response.geocode.feature.longId;

      dispatch({
        type: FETCH_VENUE_LIST,
        payload: { [groupId]: Object.values(venueArray) }
      });
    } else {
      return;
    }
  } catch {
    alert("There is no data the area that you selected.");
    return;
  }
};

async function getVenueDetail(data) {
  // Make accum
  const mergeVenueInfo = await data.reduce(async (accumVenue, info) => {
    // get Accum value
    let result = await accumVenue.then();
    // fetch detail data for each id
    const urlParams = `/${info.id}/?client_id=${FS_CLIENT_ID}&client_secret=${FS_CLIENT_SECRET}&v=20190724`;
    const response = await foursquareApi.get(urlParams);

    // set id as a key:  merge all info that you need a first loading
    result[info.id] = {
      main: info,
      detail: response.data.response.venue
    };

    // return result : using Promise.resolve to resove return data
    return Promise.resolve(result);
  }, Promise.resolve({}));

  return mergeVenueInfo;
}

export const addParticipant = (groupId, venueId, voter) => {
  return {
    type: ADD_PARTICIPANT,
    payload: {
      groupId,
      venueId,
      voter
    }
  };
};
