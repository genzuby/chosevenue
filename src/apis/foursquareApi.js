import axios from "axios";

export default axios.create({
  baseURL: "https://api.foursquare.com/v2/venues"
});
