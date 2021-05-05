/*
Copyright 2005 - 2021 Advantage Solutions, s. r. o.

This file is part of ORIGAM (http://www.origam.org).

ORIGAM is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ORIGAM is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ORIGAM. If not, see <http://www.gnu.org/licenses/>.
*/

const axios = require("axios");
const qs = require("querystring");

async function main() {
  const urlBase = "http://localhost:9099/api";
  const users = await axios.get(`${urlBase}/users`);
  console.log(users.data);
  const headers = { "x-fake-user-id": users.data[0].id };
  const chatrooms = await axios.get(`${urlBase}/chatrooms`, { headers });
  console.log(chatrooms.data);
  //const response = axios.get('/chatrooms/')

  await axios.post(
    `${urlBase}/chatrooms/${chatrooms.data[0].id}/messages`,
    {
      text: "Hello, this is a testing mesage.",
    },
    { headers }
  );

  await axios.post(
    `${urlBase}/chatrooms/${chatrooms.data[0].id}/messages`,
    {
      text: "And this is another one.",
    },
    { headers }
  );

  await axios.post(
    `${urlBase}/chatrooms/${chatrooms.data[0].id}/messages`,
    {
      text: "Yet another one.",
    },
    { headers }
  );

  const messages = await axios.get(`${urlBase}/chatrooms/${chatrooms.data[0].id}/messages`, { headers });
  console.log(messages.data);

  const messagesFiltered = await axios.get(`${urlBase}/chatrooms/${chatrooms.data[0].id}/messages`, {
    params: { afterIdIncluding: messages.data[1].id },
    headers,
  });
  console.log(messagesFiltered.data);

  const participants = await axios.get(`${urlBase}/chatrooms/${chatrooms.data[0].id}/participants`, { headers });
  console.log("PARTICIPANTS:", participants.data);

  const toInvite = await axios.get(`${urlBase}/chatrooms/${chatrooms.data[0].id}/usersToInvite`, {
    params: { searchTerm: "el", limit:1, offset: 1 },
    headers,
  });
  console.log("TO INVITE:", toInvite.data);
}
main();
