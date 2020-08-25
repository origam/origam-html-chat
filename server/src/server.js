const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const app = express();
const port = 9099;

async function anounceUserSeen(userId, chatroomId, { User }) {
  console.log(`Seen user ${userId} in ${chatroomId}`);
  await User.relatedQuery("chatrooms")
    .for(userId)
    .patch({ isOnline: true, lastSeen: Date.now() })
    .where("chatroomId", chatroomId);
}

async function periodicStatusUpdate({ User }) {
  await User.relatedQuery("chatrooms")
    .patch({ isOnline: false })
    .where("isOnline", "true")
    .where("lastSeen", "<", Date.now() - 1 * 60 * 1000);
}

function start({ dataEngine, userRepo, chatroomRepo }) {
  const { User, Chatroom, Message } = dataEngine;

  app.use(cors());
  app.use(express.json());

  app.get("/api/chatroom", async (req, res) => {
    res.send(await Chatroom.query());
  });

  app.get("/api/chatrooms/:chatroomId/messages", async (req, res) => {
    /* Parameters:
      limit?
      beforeIdIncluding?
      afterIdIncluding?
    */

    const userId = req.headers["x-fake-user-id"];
    const chatroomId = req.params.chatroomId;
    const afterIdIncluding = req.query.afterIdIncluding;
    const beforeIdIncluding = req.query.beforeIdIncluding;
    const limit = req.query.limit;
    await anounceUserSeen(userId, chatroomId, { User });
    let query = Message.query().where("chatroomId", chatroomId).orderBy("timeSent");
    if (afterIdIncluding) {
      const afterMessage = await Message.query().findById(afterIdIncluding).select("timeSent");
      if (afterMessage) {
        query = query.where("timeSent", ">=", afterMessage.timeSent);
      }
    }
    if (beforeIdIncluding) {
      const beforeMessage = await Message.query().findById(beforeIdIncluding).select("timeSent");
      if (beforeMessage) {
        query = query.where("timeSent", "<=", beforeMessage.timeSent);
      }
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    const messages = await query;
    res.send(messages);
  });

  app.post("/api/chatrooms/:chatroomId/messages", async (req, res) => {
    const userId = req.headers["x-fake-user-id"];
    const chatroomId = req.params.chatroomId;
    const text = req.body.text;
    const id = req.body.id;

    await anounceUserSeen(userId, chatroomId, { User });
    await Message.query().insert({
      id,
      timeSent: Date.now(),
      authorId: userId,
      chatroomId: chatroomId,
      text: text,
    });
    res.send();
  });

  app.get("/api/chatrooms/:chatroomId/info", async (req, res) => {
    const chatroom = await Chatroom.query().findById(req.params.chatroomId);
    res.send(chatroom);
  });

  app.post("/api/chatrooms/:chatroomId/info", async (req, res) => {
    await Chatroom.query().findById(req.params.chatroomId).patch({ name: req.body.name });
    res.send();
  });

  app.get("/api/chatrooms/:chatroomId/participants", async (req, res) => {
    const participants = await Chatroom.relatedQuery("users")
      .for(req.params.chatroomId)
      .where((b) => b.where("isOnline", true).orWhere("isInvited", true));
    res.send(participants);
  });

  app.post("/api/chatrooms/:chatroomId/participants/invite", async (req, res) => {
    const chatroomId = req.params.chatroomId;
    const inviteUserId = req.query.inviteUserId;
    await Users.relatedQuery("chatrooms").for(inviteUserId).relate({ id: chatroomId, isInvited: true });
    res.send();
  });

  app.post("/api/chatrooms/:chatroomId/leave", async (req, res) => {
    const userId = req.headers["x-fake-user-id"];
    const chatroomId = req.params.chatroomId;
    await Users.relatedQuery("chatrooms").for(userId).unrelate({ id: chatroomId });
    res.send();
  });

  app.get("/api/chatrooms/:chatroomId/usersToInvite", async (req, res) => {
    /*
      limit?
      offset?
      searchTerm? 
    */
    const { limit, offset, searchTerm } = req.query;
    const chatroomId = req.params.chatroomId;
    let query = User.query().orderBy("name");
    if (limit !== undefined) {
      query = query.limit(parseInt(limit));
    }
    if (offset !== undefined) {
      query = query.offset(parseInt(offset));
    }
    if (searchTerm !== undefined) {
      query = query.where("name", "like", `%${searchTerm}%`);
    }
    const users = await query;
    res.send(users);
  });

  app.get("/api/chatrooms/:chatroomId/usersToMention", async (req, res) => {
    const users = await User.query().select().orderBy([]);
    res.send();
  });

  app.get("/api/users", async (req, res) => {
    const users = await User.query().select().orderBy("name");
    res.send(users);
  });

  app.get("/api/chatrooms", async (req, res) => {
    const chatrooms = await Chatroom.query().select().orderBy("name");
    res.send(chatrooms);
  });

  app.get("/api/messages", async (req, res) => {
    res.send(msgStorage);
  });

  app.post("/api/messages", async (req, res) => {
    msgStorage.push(req.body);
    res.sendStatus(200);
  });

  const adminRouter = express.Router();
  startAdmin({ app: adminRouter, userRepo, chatroomRepo });
  app.use("/adminApi", adminRouter);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

  setInterval(() => periodicStatusUpdate({ User }), 60000);
}

function startAdmin({ app, userRepo, chatroomRepo }) {
  app.get("/users", async (req, res) => {
    const users = await userRepo.getUsers();
    res.send(users);
  });

  app.get("/users/:id", async (req, res) => {
    const user = await userRepo.getUser(req.params.id);
    res.send(user);
  });

  app.get("/chatrooms", async (req, res) => {
    const chatrooms = await chatroomRepo.getChatrooms();
    res.send(chatrooms);
  });
}

module.exports = { start };
