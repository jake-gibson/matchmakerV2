import React, { useRef } from 'react';

const AttendeeForm = ({ date }) => {
  const attendeeName = useRef('');
  const attendeeEmail = useRef('');
  const attendeeNumber = useRef('');
  const attendeeParty = useRef(''); // assigned an html element below
  const attendeeDate = useRef('');

  const addAttendee = () => {
    console.log(
      'New Attendee: ',
      attendeeName.current,
      attendeeEmail.current,
      attendeeNumber.current,
      attendeeParty.current.value,
      attendeeDate.current.value
    );

    const info = JSON.stringify({
      name: attendeeName.current,
      email: attendeeEmail.current,
      number: attendeeNumber.current,
      party: attendeeParty.current.value,
      date: attendeeDate.current.value,
    });

    fetch('/addAttendee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: info,
    });
  };

  return (
    <div>
      <div>
        <p>Name: </p>
        <input
          id="name"
          onChange={(e) => {
            attendeeName.current = e.target.value;
          }}
        ></input>
      </div>
      <div>
        <p>Email: </p>
        <input
          id="email"
          onChange={(e) => {
            attendeeEmail.current = e.target.value;
          }}
        ></input>
      </div>
      <div>
        <p>Number: </p>
        <input
          id="number"
          onChange={(e) => {
            attendeeNumber.current = e.target.value;
          }}
        ></input>
      </div>
      <div>
        <p>Ticket Type:</p>
        <select id="party" ref={attendeeParty}>
          {/*i could use ref for the above as well*/}
          <option value="Team1">Guys</option>
          <option value="Team2">Gals</option>
        </select>
      </div>
      <div>
        <p>Date of Event:</p>
        <select id="date" ref={attendeeDate}>
          <option value="May2024">May 2024</option>
        </select>
      </div>
      <div>
        <br></br>
        <button onClick={addAttendee}>Submit</button>
      </div>
    </div>
  );
};

export default AttendeeForm;
