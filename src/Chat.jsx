import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from 'firebase';
import { useStateValue } from './StateProvider';
import './Chat.css';
import { IconButton, Avatar } from '@material-ui/core';
import {
  Send,
  EmojiEmotionsOutlined,
  SearchOutlined,
  ArrowDropDownOutlined,
  AttachFileOutlined,
} from '@material-ui/icons';

const Chat = () => {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [clientGMT, setClinetGMT] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  var hour = 0,
    extramin = 0,
    minutes = 0,
    hourly = 0,
    GMTminutes = String(clientGMT).slice(4, 6),
    fix = 0;

  function getTimeZone() {
    var offset = new Date().getTimezoneOffset(),
      o = Math.abs(offset);
    return (
      (offset < 0 ? '+' : '-') +
      ('00' + Math.floor(o / 60)).slice(-2) +
      ':' +
      ('00' + (o % 60)).slice(-2)
    );
  }
  useEffect(() => {
    setClinetGMT(getTimeZone());
    //  console.log(clientGMT);
  }, []);
  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot(snapshot => {
          setRoomName(snapshot.data().name);
        });
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()));
        });
    }
  }, [roomId]);

  const sendMessage = async e => {
    e.preventDefault();
    if (input.length > 0) {
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add({
          message: input,
          name: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: localStorage.getItem('photoURL'),
        });

      setInput('');
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFileOutlined />
          </IconButton>
          <IconButton>
            <ArrowDropDownOutlined />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        <div className="chat__body__daystamp">
          <p>fix date</p>
        </div>
        {messages.map(message => (
          <p
            key={message.timestamp + message.message}
            className={`chat__message ${
              message.name === user.displayName && 'chat__reciever'
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              <span style={{ display: 'none' }}>
                {
                  (minutes =
                    parseInt(
                      String(
                        new Date(message.timestamp?.toDate()).toUTCString()
                      ).slice(20, 22)
                    ) +
                      parseInt(GMTminutes) +
                      extramin -
                      fix >
                    60
                      ? (parseInt(
                          String(
                            new Date(message.timestamp?.toDate()).toUTCString()
                          ).slice(20, 22)
                        ) +
                          parseInt(GMTminutes) +
                          extramin -
                          fix) %
                        60
                      : parseInt(
                          String(
                            new Date(message.timestamp?.toDate()).toUTCString()
                          ).slice(20, 22)
                        ) +
                        parseInt(GMTminutes) +
                        extramin -
                        fix)
                }
                {(hour = extramin > 0 ? 1 : 0)}

                {
                  (hourly =
                    parseInt(
                      String(
                        new Date(message.timestamp?.toDate()).toUTCString()
                      ).slice(17, 19)
                    ) +
                      hour +
                      parseInt(clientGMT) >
                    24
                      ? (parseInt(
                          String(
                            new Date(message.timestamp?.toDate()).toUTCString()
                          ).slice(17, 19)
                        ) +
                          hour +
                          parseInt(clientGMT)) %
                        24
                      : parseInt(
                          String(
                            new Date(message.timestamp?.toDate()).toUTCString()
                          ).slice(17, 19)
                        ) +
                        hour +
                        parseInt(clientGMT))
                }
              </span>
              {hourly ? hourly % 12 : '00'}
              {' : '}
              {minutes !== 0 ? (minutes < 10 ? '0' + minutes : minutes) : '00'}
              {hourly > 12 ? ' PM' : ' AM'}
            </span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat__footer">
        <IconButton>
          <EmojiEmotionsOutlined />
        </IconButton>
        <form action="">
          <input
            value={input}
            onChange={e => {
              setInput(e.target.value);
            }}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            send a message
          </button>
        </form>
        <IconButton onClick={sendMessage}>
          {input.length >= 1 ? (
            <Send style={{ color: 'limegreen' }} />
          ) : (
            <Send />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;
