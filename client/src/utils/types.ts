import { Chat, User } from "@prisma/client";

export type ChatAndUsers = Chat & {
  user1: User;
  user2: User;
};
