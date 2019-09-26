import React, { useState } from "react";
import styled from "styled-components";
import "../style/main.scss";
// Component of the location input box and the list of the input
import SearchLocation from "./SearchLocation";
import VenueList from "./VenueList";

const App = () => {
  // initialize state for if the location list close or open
  const [closeState, setCloseState] = useState(false);
  // loding circle active or not
  const [loadingState, setLoadingState] = useState(false);

  // when user click outside of list, close location list
  const onClose = () => {
    setCloseState(true);
  };

  // when user search a list, set list close state to 'false'
  const setList = () => {
    setCloseState(false);
  };

  // loading bar to fetch data
  const loadingAniOnOff = param => {
    setLoadingState(param);
  };

  return (
    <BODY onClick={onClose}>
      <TITLE>Vote for Lunchplace!</TITLE>
      <SearchLocation
        close={closeState}
        openList={setList}
        loading={param => loadingAniOnOff(param)}
      ></SearchLocation>
      <VenueList
        loading={param => loadingAniOnOff(param)}
        loadState={loadingState}
      ></VenueList>
    </BODY>
  );
};

const BODY = styled.div`
  min-height: 98vh;
  width: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 1em;
`;

const TITLE = styled.h1`
  color: #fff;
  font-weight: 300;
  font-size: calc(1rem+2vw);
`;

export default App;
