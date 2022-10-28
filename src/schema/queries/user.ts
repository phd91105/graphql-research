import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { Users } from "../../entities/users";
import { UserType } from "../typeDefs/user";

export const getUserList = {
  type: new GraphQLList(UserType),
  resolve() {
    return Users.find();
  },
};

export const getUserById = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: any, args: any) {
    const result = await Users.findOneBy({ id: args.id });
    return result;
  },
};
