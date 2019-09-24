import axios from "axios";

export default axios.create({
  baseURL: "https://devru-latitude-longitude-find-v1.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
    "x-rapidapi-key": "27cc66b6cfmsh6233e4dde334950p185afcjsnecb374806fcb"
  }
});
