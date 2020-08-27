import axios from "axios";
import React, { useEffect, useState } from "react";
import { flow } from "mobx";
import { Link } from "react-router-dom";

const URL_BASE = "http://localhost:9099/api";

export function ChatAppSetup() {
  const [users, setUsers] = useState<any[]>([]);
  const [chatrooms, setChatrooms] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedChatroom, setSelectedChatroom] = useState("");
  useEffect(() => {
    flow(function* () {
      const users = yield axios.get(`${URL_BASE}/users`);
      console.log(users.data);
      setUsers(users.data);
      const chatrooms = yield axios.get(`${URL_BASE}/chatrooms`);
      console.log(chatrooms.data);
      setChatrooms(chatrooms.data);
    })();
  }, []);
  return (
    <div>
      <h1>Setup</h1>
      <Link to={`/chatroom?chatroomId=${selectedChatroom}&fakeUserId=${selectedUser}`}>Go to chatroom</Link>
      <h2>Users</h2>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <input
              type="radio"
              name="user"
              value={user.id}
              checked={user.id === selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            />
            {user.id} - {user.name}
          </div>
        ))}
      </div>
      <h2>Chatrooms</h2>
      <div>
        {chatrooms.map((chatroom) => (
          <div key={chatroom.id}>
            <input
              type="radio"
              name="chatroom"
              value={chatroom.id}
              checked={chatroom.id === selectedChatroom}
              onChange={(e) => setSelectedChatroom(e.target.value)}
            />
            {chatroom.id} - {chatroom.name}
          </div>
        ))}
      </div>
    </div>
  );
}
