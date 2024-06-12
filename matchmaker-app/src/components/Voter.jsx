import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Voter = ({ list, person }) => {
  const [team, setTeam] = useState(null);
  const [votes, setVotes] = useState(null);

  const tallyVotes = () => {
    const ballotList = document.querySelectorAll('.vote');

    const votes = [];

    ballotList.forEach((el) => {
      if (el.checked) votes.push(el.name);
    });
    console.log(votes);

    const body = { person: person.name, votes: votes, date: person.date };

    //here we can send these votes to the DB
    axios.put('/addVotes', body);
  };

  let ballot = [];

  if (team) {
    ballot = list[team.toLowerCase()].map((attendee) => (
      <span className="ballot">
        <input
          className="vote"
          name={`${attendee.name}`}
          type="checkbox"
          // checked={person.votes.includes(attendee.name)}
          // onChange={(e) => {
          //   console.log(e);
          //   if (e.target.checked === false) {
          //     console.log('unchecking');
          //     const temp = e.target;
          //     temp.checked = false;
          //   }
          //this would be easier with useContext to know who is selected
          // }}
        ></input>
        <p>{attendee.name}</p>
      </span>
    ));
  }

  useEffect(() => {
    console.log(list);
    console.log(person);
    const ballotList = document.querySelectorAll('.vote');

    ballotList.forEach((el) => {
      if (el.checked) el.checked = false;
    });

    if (person) {
      const otherTeam = person.party === 'Team1' ? 'Team2' : 'Team1';
      console.log(otherTeam);
      setTeam(otherTeam);
    }
  }, [person]);

  return (
    <div id="voter">
      <h4>{person.name}:</h4>
      <div id="ballots">{ballot}</div>
      <button id="submit" onClick={tallyVotes}>
        Submit
      </button>
    </div>
  );
};

export default Voter;
