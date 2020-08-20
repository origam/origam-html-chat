const express = require("express");
const cors = require("cors");

const app = express();
const port = 9099;

function start({ dataEngine, userRepo, chatroomRepo }) {
  app.use(cors());
  app.use(express.json());

  app.get("/api/messages", (req, res) => {
    res.send(msgStorage);
  });

  app.post("/api/messages", (req, res) => {
    msgStorage.push(req.body);
    res.sendStatus(200);
  });

  const adminRouter = express.Router();
  startAdmin({ app: adminRouter, userRepo, chatroomRepo });
  app.use("/adminApi", adminRouter);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
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
