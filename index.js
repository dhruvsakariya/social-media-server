const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB } = require("./config");

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};
const books = [
  {
    title: "The Awakening!!!!!!!!!!",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log("mongo db connected");
  return server.listen({ port: 5000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
