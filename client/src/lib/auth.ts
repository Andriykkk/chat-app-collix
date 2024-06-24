import { User } from "@prisma/client";
import prisma from "./prisma";
import { compare } from "bcrypt";

type signInType = (
  username: string,
  password: string
) => Promise<User | null>;

export const signIn: signInType = async (
  username,
  password
) => {
  if (!username || !password) return null;
  const user = await prisma.user.findFirst({
    where: {
      email: username,
    },
  });
  console.log(user);

  console.log(
    "username: ",
    username,
    "password: ",
    password
  );
  if (user && (await compare(password, user.password))) {
    user.password = "";
    return user;
  } else throw new Error("Invalid credentials");
};
