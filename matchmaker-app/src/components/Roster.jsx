import React from 'react';

const Roster = ({ list, selectPerson, person }) => {
  const attendees = [];

  console.log(list);

  //get the list and then when I click a name it opens up the voter component for the opposing team with check boxes and a button that says submit
  //on submit button that persons info is updated...

  let key = 0;
  for (let attendee of list) {
    attendees.push(
      <p
        key={`key${key++}`}
        style={{ fontWeight: `${person?.name === attendee.name ? 600 : 300}` }}
        onClick={() => selectPerson(attendee)}
      >
        {attendee.name}
      </p>
    );
  }

  return <div id="roster">{attendees}</div>;
};

export default Roster;
