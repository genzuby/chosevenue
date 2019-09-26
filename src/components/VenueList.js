import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
// for responsive web
import media from "./media";
// component for each venue info
import VenueCard from "./VenueCard";
// import loading Component
import LoadingAni from "./LoadingAni";

// This component is parent of each card.
// This component pass venue id to get data from redux on the child
class VenueList extends React.Component {
  // for loading bar
  state = { groupid: null };

  // need to modify with getDerivedStateFromProps() method
  UNSAFE_componentWillReceiveProps(nextProps) {
    // when component get new props. if groupid is changed show loading component
    const nextGroupid = Object.keys(nextProps.venueList);
    const currGroupid = Object.keys(this.props.venueList);

    // next venue groupid is not same with this props groupid and loading state from parent is true
    if (nextGroupid !== currGroupid && this.props.loadState)
      this.props.loading(false);
    else if (nextGroupid === currGroupid && !this.props.loadState) {
      // next venue groupid is same with this props groupid and loading state from parent is false
      this.props.loading(true);
      this.setState({ groupid: currGroupid });
    }
  }

  setRankingArry = () => {
    if (!this.props.voters) return;

    // object to aeey
    const arry = Object.entries(this.props.voters);
    // make object arry , ease to use
    const getVotes = arry.map(data => {
      return { id: data[0], count: data[1].length };
    });

    // sort by vote count
    const sorted = getVotes.sort((a, b) => {
      return b.count - a.count;
    });

    // set ranking
    let rank = 1;
    for (var i = 0; i < sorted.length; i++) {
      // increase rank only if current score less than previous
      if (i > 0 && sorted[i].count < sorted[i - 1].count) {
        rank++;
      }
      sorted[i].rank = rank;
    }

    return sorted;
  };

  renderRanking = venueid => {
    const rankArry = this.setRankingArry();

    if (!rankArry) return;

    // find ranking info by venue id to send properties to VenueCard
    const result = rankArry.find(rank => rank.id === venueid);
    return result;
  };

  // to render each restaurant information
  renderVenueList = () => {
    // group id to update data for voting
    const keyval = Object.keys(this.props.venueList);

    if (this.props.loadState && keyval !== this.state.groupid) {
      return <LoadingAni></LoadingAni>;
    } else {
      this.props.loading(false);
    }

    if (this.props.venueList[keyval]) {
      return this.props.venueList[keyval].map(vanue => {
        return (
          <VenueCard
            key={vanue.main.id}
            groupid={keyval}
            venueid={vanue.main.id}
            rankInfo={this.renderRanking(vanue.main.id)}
          ></VenueCard>
        );
      });
    } else if (this.props.venueList.length === 0) {
      // when there is no data from result
      if (this.props.loadState) {
        return <LoadingAni></LoadingAni>;
      } else {
        return (
          <NOTICE>
            No restaurant found!
            <br />
            <br />
            Please search for a valid location!
          </NOTICE>
        );
      }
    }
  };

  render() {
    return <VENUES>{this.renderVenueList()}</VENUES>;
  }
}

// get Venue data from redux store
const mapStateToProps = state => {
  const groupid = Object.keys(state.venueList);
  return {
    venueList: state.venueList,
    voters: state.voters[groupid]
  };
};

const VENUES = styled.div`
  min-height: 75vh;
  width: 100%;
  /* background: rgba(255, 255, 255, 0.5); */
  background: rgba(0, 128, 128, 0.3);
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  ${media.pad`
    flex-direction : column;
    overflow-y: auto;
    padding : 2em 0;
  `};

  ${media.mobile`
    flex-direction : column;
    overflow-y: auto;
    padding : 2em 0;
  `};
`;

const NOTICE = styled.p`
  font-family: inherit;
  color: #fff;
  font-size: calc(1rem + 0.3vw);
`;

// connect redux data with react component
export default connect(mapStateToProps)(VenueList);
