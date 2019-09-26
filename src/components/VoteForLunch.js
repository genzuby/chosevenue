import React, { useState, useRef } from "react";
import { connect } from "react-redux";
// import action creator for vote
import { addParticipant } from "../action";
import styled from "styled-components";
// for responsive web
import media from "./media";

// This component is vote information and action of each card
// This component gets tha data from redux store by venue id and group id
// when user vote a venue, it will call action creator(addParticipant) and update in redux store
// User can only one vote by their name, spaces that are inserted in names will be ignored and only applied one space.
const VoteForLunch = ({
  onHandleState,
  groupid,
  venueid,
  addParticipant,
  venueList,
  voters
}) => {
  // set state for toggle vote menu
  const [tableHeightState, setTableHeightState] = useState(false);

  // initialize input
  let refInputName = useRef(null);

  // input space trim funtion
  const textTrim = txtValue => {
    // split with one space
    const arryText = txtValue.split(" ");
    // remove array item when it is not a word
    const filterdArry = arryText.filter(word => word.length > 0);

    // make return result using array value
    const result = filterdArry.reduce((cum, val, i) => {
      return cum + val + (i === filterdArry.length - 1 ? "" : " ");
    }, "");

    return result;
  };

  // vote component toggle and also modify parent component size with
  const toggleVoteTable = e => {
    if (!tableHeightState) {
      setTableHeightState(true);
      onHandleState();
    } else {
      setTableHeightState(false);
      onHandleState();
    }
  };

  // handle Key down on input
  const handleKeyDownInput = e => {
    if (e.keyCode === 27) {
      // ESC keydown event : clear input
      e.target.value = "";
    } else if (e.keyCode === 13) {
      // Enter key down, add vote
      onClickParicipant(e);
    }
  };

  const onClickParicipant = e => {
    if (refInputName.value.length < 3) {
      // vote for lunch, must input greater than 2 chractors
      alert("Please check your name. Name must be greater than 2 charactors.");
      return;
    }

    const votedVenue = checkNameDuplicate();
    if (votedVenue) {
      // if the name that user input is duplicated, get the venune name that is already voted by same name
      const votedVenueName = getKeyByVenueName(textTrim(refInputName.value));
      alert(`You already voted for "${votedVenueName}"`);
      return;
    }

    // call action creator to add vote history on redux store : remove space of out side of input text
    try {
      addParticipant(groupid, venueid, textTrim(refInputName.value));
      // when fetch data successfully, reset input value
      refInputName.value = "";
    } catch (err) {
      alert(err);
    }
  };

  // To avode multiple vote
  const checkNameDuplicate = () => {
    if (!voters) return;
    const inputName = textTrim(refInputName.value).toUpperCase();

    // make array are composed by all voters
    const allVoters = Object.values(voters).flat();

    // if you find same name (case insensitive), exit funcion
    const sameName = allVoters.find(voter => {
      return inputName === voter.toUpperCase();
    });

    return sameName;
  };

  const getKeyByVenueName = value => {
    // make array of votered venue ids
    const keyArr = Object.keys(voters);

    // find key by input value
    const votedId = keyArr.find(key => {
      // search the value if there is data on each venue key value
      const val = voters[key].find(
        voter => voter.toUpperCase() === value.toUpperCase()
      );
      // When couldn't find key by current key
      if (val === undefined) return null;

      return val.length > 0;
    });

    // to get venue information from veneus information by found voted venue id
    const getVenueName = venueList.find(venue => venue.main.id === votedId);

    return getVenueName.main.name;
  };

  const renderVoter = () => {
    // voter render , check where data exist or not
    if (!voters || !voters.hasOwnProperty(venueid)) return;

    // convert Object to array to use map by DESC sort
    const voterArry = Object.values(voters[venueid]).reverse();

    return voterArry.map((voter, i) => <li key={i}>{voter}</li>);
  };

  return (
    <VOTECOMP openedTable={tableHeightState}>
      <VOTEBTN onClick={toggleVoteTable} openedTable={tableHeightState}>
        <CLOSEICON
          openedTable={tableHeightState}
          title={tableHeightState ? "Close Vote" : "Open Vote"}
        >
          <i className="fas fa-times"></i>
        </CLOSEICON>
        Vote for Lunch
      </VOTEBTN>
      <VOTETABLE openedTable={tableHeightState}>
        <VOTEINPUT>
          <INPUTNAME
            ref={el => (refInputName = el)}
            type="text"
            placeholder="Input your name"
            onKeyDown={handleKeyDownInput}
          />
          <ADDPARTI onClick={onClickParicipant} title="Add participant">
            Add participant
          </ADDPARTI>
        </VOTEINPUT>
        <VOTEDINFO>
          <p>People who voted for this venue</p>
          <VOTELIST>{renderVoter()}</VOTELIST>
        </VOTEDINFO>
      </VOTETABLE>
    </VOTECOMP>
  );
};

// get voters data from redux store
const mapStateToProps = (state, ownProps) => {
  // find voters info near this location that is selected by user , with the props from parent(ownProps)
  return {
    venueList: state.venueList[ownProps.groupid],
    voters: state.voters[ownProps.groupid]
  };
};

const VOTECOMP = styled.div`
  ${props => (props.openedTable ? `height: 100%` : `height: 55%`)}
  width: 98%;
  position: relative;

  ${media.pad`
     ${props => (props.openedTable ? `height: 98%` : `height: 30%`)}
  `};
`;

// vote button : fold and close(check with tableHeightState state)
const VOTEBTN = styled.button`
  font-family: inherit;
  font-size: calc(0.8rem + 0.2vw);
  color: rgb(255, 100, 0);
  border: none;
  outline: none;
  background: none;
  position: absolute;
  ${props => (props.openedTable ? `top: 0` : `bottom: 0`)};
  left: 0;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease-out;
  display: flex;
`;

// ease to recognize to user whether voting information table is opened or not
const CLOSEICON = styled.span`
  transform: rotate(${props => (props.openedTable ? `0deg` : `45deg`)});
  transition: transform 0.15s ease-in;
  font-size: calc(0.7rem + 0.2vw);
  color: rgb(255, 100, 0);
  padding: 0.3em 0.5em 0 0;

  &:hover {
    transform: rotate(${props => (props.openedTable ? `45deg` : `0deg`)});
  }
`;

// display user list who vote for that venue
const VOTETABLE = styled.div`
  position: absolute;
  top: 1.6em;
  ${props => (props.openedTable ? `display: flex` : `display: none`)};
  ${props => (props.openedTable ? `height: 86%` : `height: 0`)};
  width: 96%;
  transition: all 0.3s ease-in-out;
  flex-direction: column;

  ${media.pad`
     ${props => (props.openedTable ? `height: 90%` : `height: 0`)}
  `};
`;

const VOTEDINFO = styled.div`
  width: 100%;
  overflow: auto;

  p {
    font-family: inherit;
    font-size: calc(0.6rem + 0.2vw);
    color: rgb(255, 100, 0);
    background: #fff;
    padding: 0.3em 0;
    margin-bottom: 2px;
    position: sticky;
    top: 0;
    left: 0;
  }
`;

const VOTELIST = styled.ul`
  width: 100%;
  padding: 0;

  li {
    padding: 0.4em 0.5em;
    background: #efefef;
    color: #969696;
    border: 1px solid rgb(255, 100, 0);
    border-top: 1px solid transparent;
    font-family: inherit;
    font-size: calc(0.7rem + 0.2vw);

    &:nth-of-type(1) {
      border-top: 1px solid rgb(255, 100, 0);
    }
  }
`;

const VOTEINPUT = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
`;

// vote input component styles
const INPUTNAME = styled.input`
  height: 2.2em;
  padding: 0.5em;
  font-family: inherit;
  font-size: calc(0.7rem+0.2vw);
  border: 1px solid rgb(255, 140, 0);
  outline: none;
  width: 100%;
  border-radius: 0;

  ${media.pad`
    width: 70%;
  `};

  &:focus {
    border: 1px solid rgb(255, 100, 0);
  }
`;

// add voting button styles
const ADDPARTI = styled.button`
  height: 2.2em;
  font-family: inherit;
  font-size: calc(0.7rem+0.2vw);
  padding: 0.5em;
  border: none;
  outline: none;
  background: rgb(255, 120, 0);
  color: #fff;
  cursor: pointer;
  width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.pad`
    width: 30%;
  `};
`;

export default connect(
  mapStateToProps,
  { addParticipant }
)(VoteForLunch);
