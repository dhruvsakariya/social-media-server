const postsResolvers = require("./Posts");
const commentResolvers = require("./Comments");
const userResolvers = require("./User");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
