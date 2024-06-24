"use client";

import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/providers/userProvider";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const InvitePage = ({
  params,
}: {
  params: { id: string };
}) => {
  const router = useRouter();
  const [session, setSession] = useState({} as any);
  const { user, setUser } = useUser();
  const [executed, setExecuted] = useState(false);
  const { id: inviteId } = params;
  const { toast } = useToast();

  const [chatUser, setChatUser] = useState<any>({});

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
    if (session?.user?.email && !executed) {
      setExecuted(true);
      const handleUsers = async (
        email: string,
        inviteId: string
      ) => {
        try {
          const response = await axios.get("/api/users", {
            params: { email },
          });
          const userData = response.data.user;
          setUser({
            ...user,
            ...userData,
          });

          const chatUser = await axios.get(
            `/api/users/invite/${inviteId}`,
            {
              params: {},
            }
          );

          if (!chatUser.data.user) {
            toast({
              title: "User not found",
              variant: "destructive",
            });
          }

          const chat = await axios.post("/api/chats", {
            user1: userData,
            user2: chatUser.data.user,
          });
          return router.push("/conversations");
        } catch (error: any) {
          console.error("Error fetching user");
        }
      };

      handleUsers(session?.user?.email, inviteId);
    }
  }, [session]);

  return <div>invite</div>;
};

export default InvitePage;
