import React, { useState, useEffect } from 'react';
import db from './firebase';
import SidebarChat from './SidebarChat';
import './Sidebar.css';
import { IconButton, Avatar } from '@material-ui/core';
import { useStateValue } from './StateProvider';
import { SearchOutlined, MoreVert, DonutLarge } from '@material-ui/icons';

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [sidebarBool, setsidebarBool] = useState(true);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState([]);

  const handleChange = e => {
    setsidebarBool(false);
    setInput(e.target.value);
  };

  const matcher = (s, values) => {
    const re = RegExp(`.*${s.toLowerCase().split('').join('.*')}.*`);
    return values.filter(v => v.data.name.toLowerCase().match(re));
  };

  useEffect(() => {
    if (rooms.length > 0) {
      setSearch(matcher(input, rooms));
    }
    if (input === '') {
      setsidebarBool(true);
    }
  }, [input, rooms]);

  useEffect(() => {
    const unsubscribe = db.collection('rooms');
    db.collection('rooms').onSnapshot(snapshot => {
      setRooms(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input
            onChange={handleChange}
            value={input}
            placeholder="Search"
            type="text"
          />
        </div>
      </div>
      {sidebarBool ? (
        <div className="sidebar__chats">
          <SidebarChat addNewChat />
          {rooms.map(room => (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          ))}
        </div>
      ) : (
        <div className="sidebar__chats">
          <SidebarChat addNewChat />
          {search.map(room => (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
