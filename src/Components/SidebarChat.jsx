import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import db from './firebase';
import './SidebarChat.css';
import { Avatar } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const SidebarChat = ({ addNewChat, id, name }) => {
  const location = useLocation();
  const [messages, setMessages] = useState('');

  const createChat = () => {
    const roomName = prompt('please enter room name');

    if (roomName) {
      db.collection('rooms').add({
        name: roomName,
      });
    }
  };

  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot =>
          setMessages(snapshot.docs.map(doc => doc.data()))
        );
    }
  }, [id]);

  const deleteRoom = () => {
    const passwordVerify = prompt('Enter Admin Password to delete Room');
    if (passwordVerify === 123) {
      db.collection('rooms')
        .doc(id)
        .delete()
        .then(function () {
          window.location = '/';
        })
        .catch(function (error) {
          console.error('Error removing document: ', error);
        });
    } else {
      alert('You are not authorised to delete rooms');
    }
  };

  return !addNewChat ? (
    <div
      className={`sidebarChat ${
        location.pathname === `/rooms/${id}` && `sidebarChat__selected`
      }`}
    >
      <Link
        style={{ textDecoration: 'none', color: 'black' }}
        to={`/rooms/${id}`}
      >
        <div className="sidebarChat__wrapper">
          <Avatar src={messages[0]?.photoURL} />
          <div className="sidebarChat__info">
            <h2>{name}</h2>
            <p className="sidebar__lastmessages__color">
              {messages[0]?.name ? messages[0]?.name + ': ' : ''}
              {messages[0]?.message}
            </p>
          </div>
        </div>
      </Link>
      <div className="sidebarChat__delete" onClick={deleteRoom}>
        <DeleteForeverIcon />
      </div>
    </div>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      Create new room
    </div>
  );
};

export default SidebarChat;
