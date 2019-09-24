import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
// for responsive web
import media from "./media";
// import vote component
import VoteForLunch from "./VoteForLunch";

// This component is for each informaton of card.
// This component gets tha data from redux store by venue id from parent component(VenueList)
const VenueCard = ({ venueList, groupid, venueid, rankInfo, voters }) => {
  // set State to handle "TEXTAREA" for voting area
  const [voteAreaState, setVoteAreaState] = useState(false);

  const veneuInfo = venueList.detail;

  // get Background Image Info
  const getBgImage = () => {
    const picObj = veneuInfo.photos.groups.find(
      groupinfo => groupinfo.type === "venue"
    );
    // if no image, use substitute image
    if (!picObj) return "/images/lunch-noimg.jpg";

    const picInfo = picObj.items[0];
    // if no image, use substitute image
    if (!picInfo) return "/images/lunch-noimg.jpg";

    return `${picInfo.prefix}${picInfo.width}x${picInfo.height}${picInfo.suffix}`;
  };

  // function to merge data to show in one line
  const accData = (data, divider, key) => {
    if (key === undefined) {
      // there is no key under the data hierarchy
      return data.reduce((accumData, datum, i) => {
        return accumData + datum + (i === data.length - 1 ? "" : divider);
      }, "");
    } else {
      // when there is a key under the data hierarchy.
      return data.reduce((accumData, datum, i) => {
        return accumData + datum[key] + (i === data.length - 1 ? "" : divider);
      }, "");
    }
  };

  // function for hompage link
  const renderLinkInfo = () => {
    return veneuInfo.url ? (
      <LINKPAGE href={veneuInfo.url} target="_blank" rel="noopener noreferrer">
        <i className="fas fa-globe" title="Go to Homepage"></i>
      </LINKPAGE>
    ) : (
      ""
    );
  };

  // function for foursquare link
  const fourSqLink = () => {
    return veneuInfo.canonicalUrl ? (
      <LINKPAGE
        href={veneuInfo.canonicalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-foursquare" title="Go to Fourquare Page"></i>
      </LINKPAGE>
    ) : (
      ""
    );
  };

  // to render rating information
  const renderRatingInfo = () => {
    if (!veneuInfo.rating) return;
    return (
      <RATING bgColor={"#" + veneuInfo.ratingColor}>
        {veneuInfo.rating}
        <span>/{veneuInfo.ratingSignals}</span>
      </RATING>
    );
  };

  // to handel "TEXTAREA" using child toggle state
  const displayVotePage = () => {
    if (!voteAreaState) setVoteAreaState(true);
    else setVoteAreaState(false);
  };

  const renderRanking = () => {
    // when the venue didnt get any vote, set 3rd place.
    if (rankInfo === undefined) {
      return (
        <div className="vote">
          <p>No one picks this venue yet</p>
        </div>
      );
    }

    const medal = rankInfo.rank === 1 ? <i className="fas fa-medal"></i> : "";
    const descRank = `No.${rankInfo.rank} (get ${rankInfo.count} votes)`;
    return (
      <div className="vote">
        {medal}
        <p>{descRank}</p>
      </div>
    );
  };

  return (
    <CARDBODY bgImg={getBgImage()}>
      <MAININFO>
        {renderRanking()}
        {/* venue name */}
        <h2 className="name">{veneuInfo.name}</h2>
        {renderRatingInfo()}
        {/* venue category */}
        <h3 className="desc">{accData(veneuInfo.categories, ", ", "name")}</h3>
      </MAININFO>
      <DETAILINFO>
        <TEXTAREA
          height={voteAreaState ? "98%" : "55%"}
          width={voteAreaState ? "98%" : "60%"}
          display={voteAreaState ? "flex" : "block"}
        >
          <TEXTINFO display={voteAreaState ? "none" : "block"}>
            <p className="detailinfo">
              {accData(veneuInfo.location.formattedAddress, " ")}
            </p>
            <p className="detailinfo">
              TEL : {veneuInfo.contact.formattedPhone}
            </p>
            <ICONGROUP>
              {renderLinkInfo()}
              {fourSqLink()}
            </ICONGROUP>
          </TEXTINFO>
          <VoteForLunch
            onHandleState={displayVotePage}
            groupid={groupid}
            venueid={venueid}
          />
        </TEXTAREA>
      </DETAILINFO>
    </CARDBODY>
  );
};

// get Venue data from redux store
const mapStateToProps = (state, ownProps) => {
  // find and return the venue object with the props from parent(ownProps)
  return {
    venueList: state.venueList[ownProps.groupid].find(
      venue => venue.main.id === ownProps.venueid
    ),
    // venueList: state.venueList[ownProps.groupid][ownProps.venueid],
    voters: state.voters[ownProps.groupid]
  };
};

// main styles venue card
const CARDBODY = styled.div`
  background-image: url(${props => props.bgImg});
  background-size: cover;
  height: 500px;
  min-width: 350px;
  width: 28%;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  margin: auto 1em;
  /* display set as a grid for responsive web */
  display: grid;
  grid: 35% 65% / auto;

  ${media.pad`
  /* media query from media.js( 1210 ~ 581) */
    grid:  auto/ 40% 60%;
    height: 260px;
    width: 86%;
    margin : .5em auto;
  `};

  ${media.mobile`
  /* media query from media.js( 580 ~ 1) */
    margin : .5em auto;
  `};
`;

/* venue card top area information styles */
const MAININFO = styled.div`
  grid-row: 1;
  background: rgba(0, 0, 0, 0.5);
  padding: 1em;
  display: grid;
  color: #fff;
  font-family: inherit;
  grid-template-columns: 15% 65% 20%;
  grid-template-rows: 15% auto 1fr;
  grid-template-areas:
    " vote vote vote "
    " name name rating "
    " desc desc rating ";

  ${media.pad`
    grid-row: 1;
    grid-column : 1;
    grid-template-columns: 35% 35% 30%;
    grid-template-rows: 15% auto 1fr 30%;
    grid-template-areas:
      " vote vote vote "
      " name name name "
      " desc desc desc "
      " . . rating ";
  `};

  * {
    margin: 0;
  }

  h3 {
    font-weight: 200;
  }

  .vote {
    grid-area: vote;
    display: flex;
    font-size: calc(0.8rem + 0.2vw);

    i {
      font-size: calc(1rem + 0.3vw);
      color: #e4ff1a;
      margin-right: 0.5em;
    }
  }

  .name {
    grid-area: name;
    font-size: calc(1.2srem + 0.5vw);
  }

  .desc {
    grid-area: desc;
    padding-top: 0.5em;
    font-size: calc(0.7rem + 0.3vw);
  }
`;

const RATING = styled.div`
  grid-area: rating;
  background: ${props => (props.bgColor ? props.bgColor : `#29ccab`)};
  border-radius: 3px;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc(0.9rem + 0.3vw);

  ${media.pad`
    height: 80%;
  `};

  span {
    font-size: calc(0.6rem + 0.2vw);
    padding-top: 0.3em;
  }
`;

const DETAILINFO = styled.div`
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: baseline;

  ${media.pad`
    grid-row: 1;
    grid-column : 2;
    align-items: center;
    justify-content: flex-end;
  `};
`;

const TEXTAREA = styled.div`
  margin: auto 0.5em 0.5em;
  width: 98%;
  height: ${props => props.height};
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 1em;
  transition: all 0.3s ease-in-out;

  ${media.pad`
    height: 96%;
    margin: auto 0.5em;
    width : ${props => props.width};
    display : ${props => props.display};
    padding-left : 2em;
  `};

  * {
    margin: 0;
  }

  .detailinfo {
    color: #333232;
    font-family: inherit;
    font-size: calc(0.7rem + 0.2vw);
    padding: 0.3em 0;
  }
`;

const TEXTINFO = styled.div`
  ${media.pad`
    display : ${props => props.display};
  `};
`;

const LINKPAGE = styled.a`
  color: #0eb1d2;

  &:visited {
    color: #0eb1d2;
  }
`;

const ICONGROUP = styled.div`
  display: flex;
  padding: 0.3em 0;

  i {
    font-size: calc(1.1rem + 0.2vw);
    margin-right: 0.3em;
    &:hoer {
      color: #f9b3d1;
    }
  }
`;

export default connect(mapStateToProps)(VenueCard);
