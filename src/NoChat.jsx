import React from 'react';
import './Chat.css';

const NoChat = () => {
  return (
    <div className="chat no__chat">
      <h1 style={{ margin: 'auto' }}>
        Select Or Create A Room <br />
        To Start Chatting
      </h1>
    </div>
  );
};

export default NoChat;
