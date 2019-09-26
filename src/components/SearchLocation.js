import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
// import action creator to get venue list
import { getVenueList } from "../action";
import styled from "styled-components";
// for auto complete city list
import cityGeoDBApi from "../apis/cityGeoLocation";

// This component is to search location information and fetch data with action creator(getVenueList)
// If user found correct location informtaion, it will call action creator to fetch data from Foursquare API.
// It will get the data, when user click on one item of list , key down 'enter' on the input box , or click "SEARCH" button.
const SearchLocation = ({ close, openList, getVenueList, loading }) => {
  // Initialize city list state of React Hook
  const [cityList, setCityList] = useState(null);

  // Initialize Ref of React Hook
  let refList = useRef([]);
  let refInput = useRef(null);

  // componentDidMount or ComponentDidUpdate
  useEffect(() => {
    // when user click out side of list area, close list menu
    if (close) setCityList(null);
  }, [close]);

  // input change event handler
  const handleChange = async e => {
    // input value
    const param = e.target.value;
    // get geo information from API
    const response = await cityGeoDBApi.get(`latlon.php?location=${param}`);
    // set State
    setCityList(response.data.Results);
    // set props state to false (show list)
    openList();
  };

  const renderCityList = () => {
    const cities = cityList;
    if (!cities) return;

    // render city list
    return cities.map((city, i) => {
      // eliminate items that don't have geo location informtion(ie.Country names)
      if (city.tz === "MISSING") return "";

      return (
        <li
          key={i}
          ref={el => (refList.current[i] = el)}
          //For when press keydown on input field, cursor move to the first item of list
          tabIndex="0"
          onClick={e =>
            onClickCity(
              {
                lat: city.lat,
                lon: city.lon,
                city: city.name
              },
              e
            )
          }
          onKeyDown={e =>
            onClickCity(
              {
                lat: city.lat,
                lon: city.lon,
                city: city.name
              },
              e
            )
          }
        >
          {city.name}
        </li>
      );
    });
  };

  const handleKeyDownInput = e => {
    if (e.keyCode === 27) {
      // ESC keydown event : clear list
      e.target.value = "";
      setCityList(null);
    } else if (e.keyCode === 40) {
      // when press key down, go to the first item of the list
      if (!refList) return;
      refList.current[0].focus();
    } else if (e.keyCode === 13) {
      // Enter key down
      fetchVenuList();
    }
  };

  const fetchVenuList = () => {
    // const param = `ll=${selectedCity.lat},${selectedCity.lon}`;
    if (refInput.value.length < 2) {
      alert("Please input or select a city name!");
    }
    const param = "near=" + refInput.value;
    // fetch data
    getVenueList(param);
  };

  // click event on item of list
  const onClickCity = (cityInfo, e) => {
    // keydown enter or click
    if (e.keyCode === 13 || !e.keyCode) {
      // set city name on input box
      refInput.value = cityInfo.city;
      // loding bar active
      loading(true);
      // fetch venue list;
      fetchVenuList();
      // clear city list
      setCityList(null);
    }
  };

  return (
    // prevent from closing list when action invock on parent
    <SEARCHDIV onClick={e => e.stopPropagation()}>
      <INPUTAREA>
        <INPUTFIELD
          type="search"
          placeholder="Input location name"
          onChange={handleChange}
          onKeyDown={handleKeyDownInput}
          ref={el => (refInput = el)}
        />
        <SUBMIT onClick={fetchVenuList}>Search</SUBMIT>
      </INPUTAREA>
      <CITYLIST>{renderCityList()}</CITYLIST>
    </SEARCHDIV>
  );
};

// Input Search body styles
const SEARCHDIV = styled.div`
  position: relative;
  margin: 1em 0;
  width: inherite;
  z-index: 99;
`;

const INPUTAREA = styled.div`
  display: flex;
  width: 300px;
  background: #29ccab;
  justify-content: space-between;
  border-radius: 3px;
  padding: 1px;
`;

const SUBMIT = styled.button`
  background: #29ccab;
  color: #fff;
  padding: 0.5em 1.5em;
  outline: none;
  border: 1px solid #29ccab;
  font-family: inherit;
  cursor: pointer;
`;

// input component styles
const INPUTFIELD = styled.input`
  margin: 0;
  height: 2.5em;
  padding: 0.5em 0.7em;
  font-size: calc(0.9rem+0.2vw);
  width: 100%;
  border: 1px solid #29ccab;
  outline: none;
  font-family: inherit;
  border-radius: 3px 0 0 3px;
`;

// fetched list item styles
const CITYLIST = styled.ul`
  position: absolute;
  top: 1.2em;
  width: 300px;
  padding: 0;
  max-height: 60vh;
  overflow: auto;
  z-index: 99;

  li {
    padding: 0.8em 2em;
    border: 1px solid #29ccab;
    border-top: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease-out;
    font-family: inherit;
    font-size: 80%;
    background: #fff;

    &:hover,
    &:focus {
      color: #29ccab;
      outline: none;
      background: #aef2e4;
    }
  }
`;

// connect react component and redux store
export default connect(
  null,
  { getVenueList }
)(SearchLocation);
