import React, { useState, useRef } from "react";
import { connect } from "react-redux";
// import action creator for vote
import { addParticipant } from "../action";
import styled from "styled-components";
// for responsive web
import media from "./media";

const VoteForLunch = ({
  onHandleState,
  groupid,
  venueid,
  addParticipant,
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
      alert("Please check your name. Name must be greater than 2 chractors.");
      return;
    }

    const votedVenue = checkNameDuplicate();
    if (votedVenue) {
      alert("You already voted for lunch");
      return;
    }

    // call action creator to add vote history on redux store : remove space of out side of input text
    try {
      addParticipant(groupid, venueid, textTrim(refInputName.value));
      // when fetch data successfully, reset input value
      e.target.value = "";
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

  // const getKeyByValue = value => {
  //   const keyArr = Object.keys(voters);
  //   // return value;
  //   return keyArr.map(key => {
  //     console.log(voters[key], value);
  //     return voters[key].find(
  //       voter => voter.toUpperCase() === value.toUpperCase()
  //     );
  //   });
  // };

  const renderVoter = () => {
    // voter render , check where data exist or not
    if (!voters || !voters.hasOwnProperty(venueid)) return;

    // convert Object to array to use map by DESC sort
    const voterArry = Object.values(voters[venueid]).reverse();

    return voterArry.map((voter, i) => <li key={i}>{voter}</li>);
  };

  return (
    <VOTECOMP
      height={tableHeightState ? "52%" : "45%"}
      padheight={tableHeightState ? "80.2%" : "20%"}
    >
      <VOTEBTN onClick={toggleVoteTable}>
        <CLOSEICON
          degree={tableHeightState ? 0 : 45}
          title={tableHeightState ? "Close Vote" : "Open Vote"}
        >
          <i className="fas fa-times"></i>
        </CLOSEICON>
        Vote for Lunch
      </VOTEBTN>
      <VOTETABLE
        height={tableHeightState ? "100%" : 0}
        display={tableHeightState ? "flex" : "none"}
      >
        <VOTEINPUT>
          <INPUTNAME
            ref={el => (refInputName = el)}
            type="text"
            placeholder="Input your name"
            onKeyDown={handleKeyDownInput}
          />
          <ADDPARTI onClick={onClickParicipant}>Add participant</ADDPARTI>
        </VOTEINPUT>
        <VOTELIST>{renderVoter()}</VOTELIST>
      </VOTETABLE>
    </VOTECOMP>
  );
};

// get voters data from redux store
const mapStateToProps = (state, ownProps) => {
  // find voters info near this location that is selected by user , with the props from parent(ownProps)
  return {
    voters: state.voters[ownProps.groupid]
  };
};

const VOTECOMP = styled.div`
  height: ${props => props.height};
  width: 98%;
  position: relative;

  ${media.pad`
  height: ${props => props.padheight};
  `};
`;

const VOTEBTN = styled.button`
  font-family: inherit;
  font-size: calc(0.8rem + 0.2vw);
  color: rgb(255, 100, 0);
  border: none;
  outline: none;
  background: none;
  position: absolute;
  top: 1em;
  left: 0;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease-out;
  display: flex;
`;

const CLOSEICON = styled.span`
  transform: rotate(${props => props.degree + "deg"});
  transition: transform 0.15s ease-in;
  font-size: calc(0.7rem + 0.2vw);
  color: rgb(255, 100, 0);
  padding: 0.3em 0.5em 0 0;

  &:hover {
    transform: rotate(${props => props.degree + 45 + "deg"});
  }
`;

const VOTETABLE = styled.div`
  position: absolute;
  top: 3em;
  height: ${props => props.height};
  width: 96%;
  display: ${props => props.display};
  transition: all 0.3s ease-in-out;
  flex-direction: column;
`;

const VOTELIST = styled.ul`
  width: 100%;
  max-height: 90%;
  padding: 0;
  overflow: auto;

  li {
    padding: 0.4em 0.5em;
    background: #efefef;
    color: #969696;
    border: 1px solid rgb(255, 100, 0);
    border-top: 1px solid transparent;
    font-family: inherit;
    font-size: calc(0.7rem + 0.2vw);
  }
`;

const VOTEINPUT = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
`;

// input component styles
const INPUTNAME = styled.input`
  height: 2.2em;
  padding: 0.5em;
  font-family: inherit;
  font-size: calc(0.7rem+0.2vw);
  border: 1px solid rgb(255, 160, 0);
  outline: none;
  width: 100%;

  ${media.pad`
    width: 70%;
  `};

  &:focus {
    border: 1px solid rgb(255, 100, 0);
  }
`;

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
