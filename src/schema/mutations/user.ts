import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { Users } from "../../entities/users";
import { hashPassword, comparePassword } from "../../libs/bcrypt";
import { MessageType } from "../typeDefs/message";
import { UserType } from "../typeDefs/user";

export const createUser = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent: any, args: any) {
    const { name, username, password } = args;

    const encryptPassword = await hashPassword(password);

    const result = await Users.insert({
      name,
      username,
      password: encryptPassword,
    });

    return { ...args, id: result.identifiers[0].id, password: encryptPassword };
  },
};

export const deleteUser = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(_: any, { id }: any) {
    const result = await Users.delete({ id });
    if (result.affected! > 0) return true;
    return false;
  },
};

export const updateUser = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    input: {
      type: new GraphQLInputObjectType({
        name: "UserInput",
        fields: () => ({
          name: { type: GraphQLString },
          username: { type: GraphQLString },
          oldPassword: { type: GraphQLString },
          newPassword: { type: GraphQLString },
        }),
      }),
    },
  },
  async resolve(_: any, { id, input }: any) {
    const userFound = await Users.findOneBy({ id });
    if (!userFound) throw new Error("User not found");

    const isMatch = await comparePassword(
      userFound?.password as string,
      input.oldPassword
    );
    if (!isMatch) throw new Error("Passwords does not match");

    const newPassword = await hashPassword(input.newPassword);
    delete input.oldPassword;
    delete input.newPassword;

    input.password = newPassword;

    const response = await Users.update({ id }, input);

    if (response.affected === 0) return { message: "User not found" };

    return {
      success: true,
      message: "Update User successfully",
    };
  },
};
