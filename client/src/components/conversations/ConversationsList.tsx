"use client";

import { motion } from "framer-motion";
import Container from "../Container";
import { ScrollArea } from "../ui/scroll-area";
import ConversationItem from "./ConversationItem";
import { animations } from "@/utils/constants";
import { useUser } from "@/providers/userProvider";
import { useEffect, useRef, useState } from "react";
import prisma from "@/lib/prisma";
import axios from "axios";
import { Chat } from "@prisma/client";
import { ChatAndUsers } from "@/utils/types";
const ConversationsList = () => {
  const { user } = useUser();
  const [chatList, setChatList] = useState<any[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      const chats = await axios.get(
        `/api/chats/${user.id}`
      );

      setChatList(chats.data.chats);
    };

    fetchChats();
  }, [user]);

  return (
    <Container className='h-full'>
      <motion.div
        className='md:text-center flex h-full flex-col pt-6 relative'
        initial={animations.show.initial}
        animate={animations.show.animate}
        transition={animations.show.transition}
      >
        <div
          className='text-2xl font-semibold px-4 pb-2 relative z-20'
          style={{
            boxShadow:
              "0px 10px 35px 2px rgba(255,255,255,1), 0px 10px 13px 1px rgba(255,255,255,1)",
          }}
        >
          Your chats
        </div>
        <ScrollArea className='w-full  px-4'>
          <div className='py-6'>
            {chatList.map((chat) => (
              <ConversationItem
                key={chat.id}
                chatId={chat.id}
                user={
                  chat.user1_id === user?.id
                    ? chat.user2
                    : chat.user1
                }
                messages={chat.messages}
              />
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </Container>
  );
};

export default ConversationsList;
