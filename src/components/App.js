import React, { useState } from "react";
//for App component styles and Global styles
import styled, { createGlobalStyle } from "styled-components";
import "../style/main.scss";
// Component of the location input box and the list of the input
import SearchLocation from "./SearchLocation";
import VenueList from "./VenueList";

const App = () => {
  // initialize state for wether the location list close or open
  const [closeState, setCloseState] = useState(false);

  // when user click outside of list, close location list
  const onClose = () => {
    setCloseState(true);
  };

  // when user search a list, set list close state to 'false'
  const setList = () => {
    setCloseState(false);
  };

  return (
    <BODY onClick={onClose}>
      {/* <GlobalStyle /> */}
      <TITLE>Vote for Lunchplace!</TITLE>
      <SearchLocation close={closeState} openList={setList}></SearchLocation>
      <VenueList></VenueList>
    </BODY>
  );
};

//Set Global styles
// const GlobalStyle = createGlobalStyle`
//   * {
//     box-sizing: border-box;
//   }

//   body,html{
//     @import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');
//     padding: 0;
//     margin: 0;
//     font-family: 'Rubik', sans-serif;
//     min-width : 400px;
//     background-image : url(/images/mainbg.jpg);
//     background-color : rgba(0,0,0,0.65);
//     background-size : cover;
//     background-blend-mode : multiply;
//     width : 100%;
//     height : 100%;
//   }

//   a {
//     text-decoration: none;
//   }

//   ul,
//   li {
//     list-style: none;
//   }

// `;

const BODY = styled.div`
  min-height: 98vh;
  width: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TITLE = styled.h1`
  padding: 0;
  color: #fff;
  font-weight: 300;
  font-size: calc(1rem+2vw);
`;

export default App;
