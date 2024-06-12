import React, { useState } from 'react';

const Modal = ({ messages, toggleModal }) => {
  const [messageNum, setMessageNum] = useState(0);
  const prvMsg = () => {
    if (messageNum !== 0) setMessageNum(messageNum - 1);
  };
  const nextMsg = () => {
    if (messageNum !== messages.length - 1) setMessageNum(messageNum + 1);
  };

  return (
    <div id="modal">
      <div id="close-modal">
        <button onClick={toggleModal}>{'X'}</button>
      </div>
      <div id='message-text'>
        <pre>{messages[messageNum]}</pre>
      </div>
      <div id="fwd-bk">
        <button id="prv-button" onClick={prvMsg}>
          {'<'}
        </button>
        <button id="next-button" onClick={nextMsg}>
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default Modal;
