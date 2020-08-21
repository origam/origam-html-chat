import React, { useEffect, createContext, useContext, useState, PropsWithChildren } from "react";
import { HashRouter as Router, Switch, Route, Link, NavLink, Redirect, useHistory, useParams } from "react-router-dom";
import { flow } from "mobx";
import axios from "axios";


export function AppRoot() {
  const [appOverlayRender, setAppOverlayRender] = useState<(() => React.ReactNode) | undefined>(undefined);
  console.log(appOverlayRender);
  return (
    <CtxAppOverlayRender.Provider value={{ render: appOverlayRender, setRender: setAppOverlayRender }}>
      <Router>
        <Route path="/" exact={true}>
          <Redirect to="/admin/users" />
        </Route>
        <div>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/admin/users" exact={true}>
              <AdminNavigation />
              <Users />
            </Route>
            <Route path="/admin/users/:id">
              <AdminNavigation />
              <UserDetail />
            </Route>
            <Route path="/admin/chatrooms">
              <AdminNavigation />
              <Chatrooms />
            </Route>
            <Route path="/chatroom">
              {/*<Chatroom />*/}
            </Route>
          </Switch>
        </div>
      </Router>
      {appOverlayRender?.()}
    </CtxAppOverlayRender.Provider>
  );
}

function AdminNavigation() {
  return (
    <nav>
      <ul>
        {/*<li>
    <NavLink to="/admin/home" activeClassName="isActive">
      Admin Home
    </NavLink>
  </li>*/}
        <li>
          <NavLink to="/admin/users" activeClassName="isActive">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/chatrooms" activeClassName="isActive">
            Chatrooms
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

class AdminApi {
  urlPrefix = "http://localhost:9099/adminApi";

  *getUsers() {
    const response = yield axios.get(`${this.urlPrefix}/users`);
    return response.data;
  }

  *getUser(id: string) {
    const response = yield axios.get(`${this.urlPrefix}/users/${id}`);
    return response.data;
  }

  *addUser(user: IUser) {
    const response = yield axios.post(`${this.urlPrefix}/users`);
  }

  *getChatrooms() {
    const response = yield axios.get(`${this.urlPrefix}/chatrooms`);
    return response.data;
  }

  *getChatroomsForUserToInvite(userId: string) {
    const response = yield axios.get(`${this.urlPrefix}/chatroomsToInvite?userId=${userId}`);
    return response.data;
  }
}

const CtxAdminApi = createContext(new AdminApi());
const CtxAppOverlayRender = createContext<{
  render?: () => React.ReactNode;
  setRender: (render: () => React.ReactNode) => void;
}>({
  render() {
    return null;
  },
  setRender(render) {},
});

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

function Users() {
  const history = useHistory();
  const adminApi = useContext(CtxAdminApi);
  const appOverlay = useContext(CtxAppOverlayRender);

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    flow(function* () {
      const users = yield* adminApi.getUsers();
      setUsers(users);
    })();
  }, []);

  function handleAddUserClick() {}

  function handleInviteToChatroomClick(userId: string) {
    appOverlay.setRender(() => () => (
      <AppOverlay>
        <AppModal>
          <InviteToChatroom userId={userId} />
        </AppModal>
      </AppOverlay>
    ));
  }

  return (
    <div className="">
      <h1>Users</h1>
      <button onClick={handleAddUserClick}>Add user</button>
      <table className="userTable">
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="userList__row">
              <td>{user.id} </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>
                <button onClick={() => history.push(`/admin/users/${user.id}`)}>Detail</button>
                <button>Edit</button>
                <button>Delete</button>
                <button onClick={() => handleInviteToChatroomClick(user.id)}>Invite to chatroom</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface IChatroom {
  id: string;
  name: string;
}

function Chatrooms() {
  const history = useHistory();
  const adminApi = useContext(CtxAdminApi);

  const [chatrooms, setChatrooms] = useState<IChatroom[]>([]);

  useEffect(() => {
    flow(function* () {
      const chatrooms = yield* adminApi.getChatrooms();
      setChatrooms(chatrooms);
    })();
  }, []);

  function handleAddUserClick() {}

  return (
    <div className="">
      <h1>Chatrooms</h1>
      <button onClick={handleAddUserClick}>Add chatroom</button>
      <table className="chatroomTable">
        <tbody>
          {chatrooms.map((chatroom) => (
            <tr key={chatroom.id}>
              <td>{chatroom.id} </td>
              <td>{chatroom.name}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
                <button>Invite users</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserDetail() {
  const adminApi = useContext(CtxAdminApi);
  const { id } = useParams();

  const [user, setUser] = useState<IUser | undefined>();

  useEffect(() => {
    flow(function* () {
      const user = yield* adminApi.getUser(id);
      setUser(user);
    })();
  }, []);

  return (
    <div className="">
      <h1>User detail</h1>
      {user && (
        <div>
          <div>
            Details for {user.firstName} {user.lastName}
          </div>
        </div>
      )}
    </div>
  );
}

function InviteToChatroom(props: { userId: string }) {
  const adminApi = useContext(CtxAdminApi);

  const [user, setUser] = useState<IUser | undefined>();
  const [chatrooms, setChatrooms] = useState<IChatroom[]>([]);

  useEffect(() => {
    flow(function* () {
      const user = yield* adminApi.getUser(props.userId);
      setUser(user);
    })();
  }, []);
  useEffect(() => {
    flow(function* () {
      const chatrooms = yield* adminApi.getChatrooms();
      setChatrooms(chatrooms);
    })();
  }, []);
  return (
    <div>
      <h1>Invite to chatrooms</h1>
      {user && (
        <div>
          <div>
            Invite {user.firstName} {user.lastName} to chatrooms
          </div>
          <table className="chatroomTable">
            <tbody>
              {chatrooms.map((chatroom) => (
                <tr key={chatroom.id}>
                  <td>{chatroom.id} </td>
                  <td>{chatroom.name}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AppOverlay(props: PropsWithChildren<{}>) {
  return (
    <div className="appOverlay">
      <div className="appOverlay__body">{props.children}</div>
    </div>
  );
}

function AppModal(props: PropsWithChildren<{}>) {
  return (
    <div className="appModal">
      <div className="appModal__body">{props.children}</div>
    </div>
  );
}
