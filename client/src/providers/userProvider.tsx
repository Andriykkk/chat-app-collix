"use client";

import { User } from "@prisma/client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
}

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
