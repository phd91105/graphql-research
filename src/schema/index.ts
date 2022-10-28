import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { getUserList, getUserById } from "./queries/user";
import { createUser, deleteUser, updateUser } from "./mutations/user";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllUsers: getUserList,
    getUser: getUserById,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: createUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
