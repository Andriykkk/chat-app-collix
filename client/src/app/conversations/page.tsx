"use client";

import ConversationsList from "@/components/conversations/ConversationsList";
import MainHeader from "@/components/headers/MainHeader";
import { useUser } from "@/providers/userProvider";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [session, setSession] = useState({} as any);

  useEffect(() => {
    function fetchSession() {
      getSession().then((session) => {
        if (!session) {
          router.push("/");
        }
        setSession(session);
      });
    }

    fetchSession();
  }, []);

  useEffect(() => {
    const handleUsers = async (email: string) => {
      try {
        const response = await axios.get("/api/users", {
          params: { email },
        });
        const userData = response.data.user;

        setUser({
          user,
          ...userData,
        });
      } catch (error: any) {
        console.error("Error fetching user");
      }
    };

    if (session?.user?.email) {
      handleUsers(session?.user?.email);
    }
  }, [session]);

  return (
    <div className='w-full min-h-screen bg-black/95 flex flex-col '>
      <MainHeader />
      <ConversationsList />
    </div>
  );
}
