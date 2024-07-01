"use client";

import { messageFormSchema } from "@/utils/schemas";
import { Messages, User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PulseLoader from "../PulseLoader";
import ConversationMessage from "./ConversationMessage";
import { io } from "socket.io-client";
import { cn, getName } from "@/lib/utils";
import ConversationTime from "./ConversationTime";

interface ConversationListProps {
  user: User;
  companion: User;
}

const ConversationList = ({
  user,
  companion,
}: ConversationListProps) => {
  const [messages, setMessages] = useState<any>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messageSkip, setMessageSkip] = useState(0);
  const { conversationId } = useParams();
  const [end, setEnd] = useState(false);
  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const heightRef = useRef(0);
  const [socket, setSocket] = useState<any>();
  const [writing, setWriting] = useState(false);

  const previousDate = useRef(new Date());
  const readed = useRef(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    if (loadingMessages || end) return;
    setLoadingMessages(true);
    try {
      const response = await axios.get("/api/messages", {
        params: {
          chatId: conversationId,
          skip: messageSkip,
        },
      });

      if (response.status === 200) {
        if (response.data.messages.length === 0) {
          setEnd(true);
          setLoadingMessages(false);
          return;
        }

        if (!response.data.messages[0].read) {
          await axios.put("/api/messages", {
            chatId: conversationId,
            userId: user.id,
          });
        }

        setMessages((prev: any) => {
          const fetchMessages = response.data.messages;
          const existingMessageIds = new Set(
            prev.map((message: Messages) => message.id)
          );
          const filteredNewMessages = fetchMessages
            .filter(
              (message: Messages) =>
                !existingMessageIds.has(message.id)
            )
            .reverse();

          return [...filteredNewMessages, ...prev];
        });

        setMessageSkip(messageSkip + 20);
      }
    } catch (error) {
      console.error(error);
    }

    setLoadingMessages(false);
  };

  useEffect(() => {
    if (messages && scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - heightRef.current;

      heightRef.current = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof messageFormSchema>
  ) => {
    try {
      const response = await axios.post("/api/messages", {
        ...values,
        chatId: conversationId,
        userId: user.id,
      });
      if (response.status === 200) {
        form.reset();
        socket.emit(
          "createMessage",
          JSON.stringify({
            message: response.data.newMessage,
            conversationId,
          })
        );
        setMessages((prev: any) => [
          ...prev,
          response.data.newMessage,
        ]);
      } else {
        console.error(
          "Failed to create message:",
          response.data.newMessage
        );
      }
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef?.current?.scrollTop === 0) {
        onScrollToTop();
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener(
        "scroll",
        handleScroll
      );
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, [messageSkip]);

  const onScrollToTop = async () => {
    fetchMessages();
  };

  //socket
  useEffect(() => {
    const socket = io("http://localhost:5000");

    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("joinRoom", conversationId);
    });

    socket.on("deleteMessage", (message) => {
      setMessages((prev: any) => {
        return prev.map((msg: Messages) => {
          if (msg.id === message) {
            return {
              ...msg,
              content: null,
              deleted: true,
            };
          }
          return msg;
        });
      });
    });

    socket.on("updateMessage", (msg) => {
      const { messageId, content } = JSON.parse(msg);
      setMessages((prev: any) => {
        return prev.map((msg: Messages) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: content,
            };
          }
          return msg;
        });
      });
    });

    socket.on("createMessage", (message) => {
      setMessages((prev: any) => [...prev, message]);
    });

    socket.on("focusInput", (messageId) => {
      setWriting(true);
    });

    socket.on("blurInput", (messageId) => {
      setWriting(false);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

  if (!messages)
    return (
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <PulseLoader />
      </div>
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col pt-2 h-full relative'
      >
        <div
          className={cn(
            "w-full flex flex-col overflow-auto scroll-container mb-[100px] relative"
          )}
          ref={scrollRef}
        >
          <div className='w-full px-4 '>
            {loadingMessages && !end && (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2'>
                <PulseLoader />
              </div>
            )}
            {messages &&
              messages.map((message: Messages) => {
                const messageDate = new Date(
                  message.createdAt
                );

                const shouldRenderTimeComponent =
                  !previousDate ||
                  previousDate.current.getDate() !==
                    messageDate.getDate() ||
                  previousDate.current.getMonth() !==
                    messageDate.getMonth() ||
                  previousDate.current.getFullYear() !==
                    messageDate.getFullYear();

                previousDate.current = messageDate;
                return (
                  <div key={message.id}>
                    {shouldRenderTimeComponent && (
                      <ConversationTime
                        date={messageDate}
                      />
                    )}

                    <ConversationMessage
                      message={message}
                      setMessages={setMessages}
                      socket={socket}
                      type={
                        message.user_id === user.id
                          ? "user"
                          : "companion"
                      }
                    />
                  </div>
                );
              })}
          </div>
        </div>
        {writing && (
          <div className='absolute left-8 bottom-[94px] text-sm font-medium text-gray-400 text-left animate-pulse'>
            {getName(companion)} writing message
          </div>
        )}
        <MessageInput socket={socket} form={form} />
      </form>
    </Form>
  );
};

export default ConversationList;
