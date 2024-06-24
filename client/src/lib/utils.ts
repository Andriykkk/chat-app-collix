import { User } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getName = (user: User) => {
  if (user?.f_name) {
    if (user?.l_name) {
      return `${user?.f_name} ${user?.l_name}`;
    }
    return user?.f_name;
  }
  if (user?.username) {
    return user?.username;
  }
  if (user?.email) {
    return user?.email.split("@")[0];
  }
};
