"use client";

import Container from "@/components/Container";
import ConversationList from "@/components/conversation/ConversationList";
import ConversationHeader from "@/components/headers/ConversationHeader";
import { useUser } from "@/providers/userProvider";
import { User } from "@prisma/client";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { user, setUser } = useUser();
  const { conversationId } = useParams();
  const [companion, setCompanion] = useState<User | null>(
    null
  );

  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const companionData = await axios.get(
          `/api/chats`,
          {
            params: { id: conversationId },
          }
        );

        setCompanion(
          user?.id === companionData.data.chat.user1_id
            ? companionData.data.chat.user2
            : companionData.data.chat.user1
        );
      } catch (error: any) {
        console.log(error);

        router.push("/conversations");
      }
    };

    if (user?.id) fetchCompanion();
  }, [user]);

  useEffect(() => {
    function fetchSession() {
      getSession().then((session) => {
        if (!session) {
          router.push("/");
        }
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
          ...user,
          ...userData,
        });
      } catch (error: any) {
        console.error(
          "Error fetching user:",
          error.response?.data?.error || error.message
        );
      }
    };

    if (session?.user?.email)
      handleUsers(session?.user?.email);
  }, []);

  if (!companion || !user || !companion?.id) return null;
  return (
    <div className='w-full min-h-screen bg-black/95 flex flex-col '>
      <ConversationHeader companion={companion} />
      <Container>
        <ConversationList
          companion={companion}
          user={user}
        />
      </Container>
    </div>
  );
};

export default page;
