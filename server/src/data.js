const { Model } = require("objection");
const Knex = require("knex");
const uuid = require("uuid");

// Initialize knex.
const knex = Knex({
  client: "sqlite3",
  log: console,
  debug: true,
  useNullAsDefault: true,
  connection: {
    filename: "data.sqlite",
  },
});

// Give the knex instance to objection.
Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      chatRooms: {
        relation: Model.ManyToManyRelation,
        modelClass: Chatroom,
        join: {
          from: "users.id",
          through: {
            from: "chatrooms_users.userId",
            to: "chatrooms_users.chatroomId",
          },
          to: "chatrooms.id",
        },
      },
    };
  }
}

class Chatroom extends Model {
  static get tableName() {
    return "chatrooms";
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "chatrooms.id",
          through: {
            from: "users_chatroom.chatroomId",
            to: "users_chatroom.userId",
          },
          to: "users.id",
        },
      },
    };
  }
}

async function createSchema() {
  await knex.schema.dropTableIfExists("users_chatroom");
  //await knex.schema.dropTableIfExists("users_messages");
  //await knex.schema.dropTableIfExists("chatroom_messages");

  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("chatrooms");
  await knex.schema.dropTableIfExists("messages");

  await knex.schema.createTable("users", (t) => {
    t.specificType("id", "UUID").primary();
    t.string("firstName");
    t.string("lastName");
  });

  await knex.schema.createTable("chatrooms", (t) => {
    t.specificType("id", "UUID").primary();
    t.string("name");
  });

  await knex.schema.createTable("messages", (t) => {
    t.specificType("id", "UUID").primary();
    t.specificType("userId", "UUID");
    t.specificType("chatroomId", "UUID");
    t.dateTime("timeSent");
    t.string("text");

    t.foreign("userId").references("users.id");
    t.foreign("chatroomId").references("chatrooms.id");
  });

  await knex.schema.createTable("users_chatroom", (t) => {
    t.specificType("userId", "UUID");
    t.specificType("chatroomId", "UUID");

    t.primary(["userId", "chatroomId"]);
    t.foreign("userId").references("id").inTable("users");
    t.foreign("chatroomId").references("id").inTable("chatrooms");
  });
}

async function fillInitialData() {
  await User.query().insert({ firstName: "Pavel", lastName: "Tomasko", id: uuid.v4() });
  await User.query().insert({ firstName: "Kathy", lastName: "Red", id: uuid.v4() });
  await User.query().insert({ firstName: "Elena", lastName: "Wallace", id: uuid.v4() });
  await User.query().insert({ firstName: "Don", lastName: "Smith", id: uuid.v4() });

  await Chatroom.query().insert({ name: "General", id: uuid.v4() });
  await Chatroom.query().insert({ name: "Gossip", id: uuid.v4() });
  await Chatroom.query().insert({ name: "Future features", id: uuid.v4() });
  await Chatroom.query().insert({ name: "Bugs", id: uuid.v4() });
  await Chatroom.query().insert({ name: "Hot chicks", id: uuid.v4() });
}

async function start() {
  await createSchema();
  await fillInitialData();
  return {
    User,
    Chatroom,
  };
}

module.exports = { start };
