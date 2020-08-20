const server = require("./server");
const data = require("./data");

const { UserRepo } = require("./UserRepo");
const { ChatroomRepo } = require("./ChatroomRepo");

async function main() {
  const dataEngine = await data.start();

  const userRepo = new UserRepo({ dataEngine });
  const chatroomRepo = new ChatroomRepo({ dataEngine });

  server.start({ dataEngine, userRepo, chatroomRepo });
}

main();
