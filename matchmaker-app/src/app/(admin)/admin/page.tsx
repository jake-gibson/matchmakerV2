'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';

import Voter from '@/components/Voter.jsx';
import Roster from '@/components/Roster.jsx';
import Modal from '@/components/Modal.jsx';
import { EventEmitter } from 'stream';

const arrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const Admin = () => {
  const file = useRef(null);
  const eventDate = useRef('');
  const [showForm, setShowForm] = useState(false);
  const [list, setList] = useState([]);
  const [person, setPerson] = useState(null);
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const uploadFile = (e: MouseEvent) => {
    console.log(e.target.files[0]);
    file.current = e.target.files[0];
  };

  const sendCSV = () => {
    if (file.current === null) return;
    //post to backend for processing and upload to DB
    const formData = new FormData();
    console.log(file.current);
    console.log(eventDate.current.value);

    formData.append('file', file.current);
    formData.append('date', eventDate.current.value);

    axios.post('/addList', formData).then((res) => console.log(res));
  };

  const selectPerson = (e) => {
    setPerson(e);
  };

  const getAllAttendees = async () => {
    const list = await axios.get(`/getAllAttendees/${eventDate.current.value}`);
    console.log(list.data);
    setList(list.data);
    setShowForm(true);
  };

  const getMatches = async () => {
    const data = await axios.get(`/getMatches/${eventDate.current.value}`);
    const matchList = data.data;

    const cache = {};
    const messages = [];
    // messages.push(JSON.stringify(matchList));

    for (const attendee of list.attendeeList) {
      cache[attendee.name] = attendee;
    }

    for (const attendee in matchList) {
      let name = attendee.slice(0, attendee.indexOf(' '));
      let message = `${cache[attendee].number}\n\nHey ${name} 👋\n\nThis is Jake (🤵🏻‍♂️) from ❣️𝕄𝕒𝕥𝕔𝕙𝕞𝕒𝕜𝕖𝕣❣️\n[ꜱᴘᴇᴇᴅ ᴅᴀᴛɪɴɢ @ᴄʜᴇʀʀʏ ᴏɴ ᴛᴏᴘ]\n\n`;

      if (matchList[attendee].length > 0) {
        message += `Good news: You got a match!\n💌 💌 💌 💌 💌 💌 💌 💌 💌\n\nDrum roll please…..\n🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁\n🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁\n🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁🥁\n\n`;

        for (let vote of matchList[attendee]) {
          const str = `🆈🅾🆄 🅼🅰🆃🅲🅷🅴🅳 🆆🅸🆃🅷\n🎊🎊 ${vote.slice(
            0,
            vote.indexOf(' ')
          )} 😱🎊🎊\nFeel free to message them at ${cache[vote].number}\n\n`;

          message = message + str;
        }
      } else {
        message += `Unfortunately you didn't get any matches\n\n`;
      }

      message = message + `♡ Good luck ◡̈`;
      messages.push(message);
    }

    setMessages(messages);
    toggleModal();
  };

  return (
    <div
      id="new-event"
      className="border-2 border-rose-400 rounded-3xl h-full p-8 flex flex-col items-center space-y-4"
    >
      <div id="top-line" className="w-full flex justify-between items-center">
        <h3 className="self-start text-rose-600">Matchmaker</h3>
        <div
          id="select-date"
          className="flex justify-end items-stretch w-2/5 text-sm"
        >
          <p>Date of Event:</p>
          <select className="border rounded p-1" id="date" ref={eventDate}>
            <option value="April2024">April 2024</option>
            <option value="May2024">May 2024</option>
            <option value="June2024">June 2024</option>
            <option value="July2024">July 2024</option>
            <option value="August2024">August 2024</option>
          </select>
        </div>
      </div>
      <div
        id="uploader"
        className="self-start flex justify-start items-center "
      >
        <input
          type="file"
          name="uploaded_file"
          onChange={(e) => {
            uploadFile(e);
          }}
          className="border border-red-300 rounded border-dotted p-1 text-xs mr-1 custom-shadow-inner shadow-red-300"
        ></input>
        <button
          onClick={sendCSV}
          className="text-rose-400 hover:text-rose-500 hover:scale-110 active:text-red-800 duration-75"
        >
          {arrow}
        </button>
      </div>
      <div id="get-buttons" className="w-full flex justify-between">
        <button
          id="get-roster"
          onClick={getAllAttendees}
          className="py-1 px-2 text-sm border rounded border-red-500 text-red-500 bg-stone-100 duration-50 active:bg-stone-200"
        >
          Display Roster
        </button>
        <button
          id="get-matches"
          onClick={getMatches}
          className="py-1 px-2 text-sm border rounded border-rose-100 text-stone-100 bg-red-500 duration-50 active:bg-red-300"
        >
          Match!
        </button>
      </div>
      {showForm && (
        <div id="layout">
          <Roster
            list={list.attendeeList}
            person={person}
            selectPerson={selectPerson}
            getMatches={getMatches}
          />
          {!person ? (
            <div>Click a person to vote!</div>
          ) : (
            <Voter list={list} person={person} />
          )}
        </div>
      )}
      {/* <button onClick={toggleShowForm}>Add Attendee</button>
      {showForm && <AttendeeForm />} */}
      {modal && <Modal toggleModal={toggleModal} messages={messages} />}
    </div>
  );
};

export default Admin;
