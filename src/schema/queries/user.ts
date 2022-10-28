import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { Users } from "../../entities/users";
import { UserType } from "../typeDefs/user";

export const GET_ALL_USERS = {
  type: new GraphQLList(UserType),
  resolve() {
    return Users.find();
  },
};

export const GET_USER = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: any, args: any) {
    const result = await Users.findOneBy({ id: args.id });
    return result;
  },
};
