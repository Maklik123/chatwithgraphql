const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const crypto = require("crypto");
const app = express();

const db = {
  users: [
    {
      id: "1",
      email: "user1@gmail.com",
      name: "User1"
    },
    {
      id: "2",
      email: "user2@gmail.com",
      name: "User2"
    }
  ],
  messages: [
    {
      id: "1",
      userId: "1",
      body: "Hello",
      createdt: Date.now()
    },
    {
      id: "2",
      userId: "2",
      body: "Hi",
      createdAt: Date.now()
    },
    {
      id: "3",
      userId: "1",
      body: "What's up",
      createdAt: Date.now()
    }
  ]
};

class User {
  constructor(user) {
    Object.assign(this, user);
  }

  get messages() {
    return db.messages.filter(message => message.userId === this.id);
  }
}

const schema = buildSchema(`
    type  Query {
        users: [User!]!
        user(id: ID!): User
        messages: [Message!]!
    }
    type Mutation{
        addUser(email: String!, name: String): User!
    }
    type User{
        id: ID!
        email: String!
        avatarUrl: String
        name: String
        messages: [Message!]!
    }
    type Message{
        id: ID!
        body: String!
        createdAt: String  
    }
`);

const rootValue = {
  users: () => db.users.map(user => new User(user)),
  user: args => db.users.find(user => user.id === args.id),
  messages: () => db.messages,
  addUser: ({ email, name }) => {
    const user = {
      id: crypto.randomBytes(10).toString("hex"),
      email,
      name
    };
    db.users.push(user);
    return user;
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);

// graphql(
//   Schema,
//   `
//     {
//       users {
//         id
//         email
//         name
//       }
//     }
//   `,
//   rootValue
// )
//   .then(res => console.dir(res, { depth: null }))
//   .catch(console.error);

app.listen(3000, () => console.log("listenning on port 3000"));
