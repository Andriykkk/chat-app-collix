"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  session: any;
  children: React.ReactNode;
}

const SessionProviderWrapper: React.FC<Props> = ({
  session,
  children,
}) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
