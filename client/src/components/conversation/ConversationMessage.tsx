import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { Messages } from "@prisma/client";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";

const ConversationMessage = ({
  message,
  type,
  socket,
  setMessages,
}: {
  message: Messages;
  type: string;
  socket: any;
  setMessages: any;
}) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const { conversationId } = useParams();

  const copyToClipboard = async () => {
    if (!message.content) return;

    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  const submitMessageEditing = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditing(false);
      handleMessageSubmission();
    }
  };

  const submitMessageBlur = () => {
    setEditing(false);
    handleMessageSubmission();
  };

  const messageUpdateSchema = z.object({
    content: z.string().min(1),
  });

  const handleMessageSubmission = async () => {
    try {
      const parsedData = messageUpdateSchema.parse({
        content,
      });

      const response = await axios.post(
        `/api/messages/${message.id}`,
        {
          content,
        }
      );

      const updatedMessage = response.data.updatedMessage;
      socket.emit(
        "updateMessage",
        JSON.stringify({
          messageId: updatedMessage.id,
          content,
          conversationId,
        })
      );
      setMessages((prevMessages: any) =>
        prevMessages.map((msg: any) =>
          msg.id === updatedMessage.id
            ? { ...msg, content: updatedMessage.content }
            : msg
        )
      );
    } catch (error) {
      console.error(error);

      toast({
        title: "Something went wrong",
        description: "Please try again",
      });
    }
  };

  const getMessageContent = () => {
    if (message.deleted) {
      return (
        <p className='text-gray-500'>
          This message has been deleted
        </p>
      );
    }
    if (!editing) {
      return message.content;
    } else {
      return (
        <textarea
          className='w-full bg-transparent outline-none'
          value={`${content}`}
          autoFocus
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={submitMessageEditing}
          onBlur={submitMessageBlur}
        />
      );
    }
  };

  const handleMessageDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/messages/${message.id}`
      );

      const updatedMessage = response.data.updatedMessage;

      socket.emit(
        "deleteMessage",
        JSON.stringify({
          messageId: updatedMessage.id,
          conversationId,
        })
      );
      setMessages((prevMessages: any) =>
        prevMessages.map((msg: any) =>
          msg.id === updatedMessage.id
            ? { ...msg, deleted: true }
            : msg
        )
      );
    } catch (error) {
      console.error(error);

      toast({
        title: "Something went wrong",
        description: "Please try again",
      });
    }
  };

  const date = new Date(message?.createdAt);

  return (
    <div className='flex flex-col gap-2 mb-3'>
      <div
        className={cn(
          "flex items-center gap-4 group",
          type === "companion" ? "flex-row-reverse " : ""
        )}
      >
        <div
          className={cn(
            "p-4 rounded-[30px] max-w-[70%] text-sm",
            type === "user"
              ? "bg-lightYellow"
              : "bg-gray-100 ml-auto",
            editing && "min-w-[70%]"
          )}
          style={{ width: "fit-content" }}
        >
          {getMessageContent()}
        </div>
        <div className='flex gap-2 items-center pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all'>
          {!editing &&
            !message.deleted &&
            type === "user" && (
              <>
                <button
                  type='button'
                  onClick={copyToClipboard}
                  className='opacity-50 hover:opacity-100 cursor-pointer transition-all'
                >
                  <IoCopyOutline />
                </button>
                <button
                  type='button'
                  onClick={() => setEditing(!editing)}
                  className='opacity-50 hover:opacity-100  cursor-pointer transition-all'
                >
                  <FaRegEdit />
                </button>

                <Dialog>
                  <DialogTrigger>
                    <div className='opacity-50 hover:opacity-100 hover:text-red-500 cursor-pointer transition-all'>
                      <AiOutlineDelete />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure?
                      </DialogTitle>
                      <DialogContent>
                        <div>
                          This action cannot be undone.
                        </div>
                        <div className='flex items-center justify-end gap-4'>
                          <DialogClose asChild>
                            <Button
                              onClick={handleMessageDelete}
                              className='bg-red-300 text-black text-lg font-semibold py-6 rounded-full cursor-pointer hover:bg-red-300/80'
                            >
                              Yes
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button className='bg-mainYellow text-black text-lg font-semibold py-6 rounded-full  cursor-pointer hover:bg-mainYellow/80'>
                              No
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </>
            )}
        </div>
        {type === "companion" && (
          <div className='flex-1'></div>
        )}
      </div>
      <div
        className={cn(
          "text-xs text-gray-400",
          type === "user" ? "text-left" : "text-right"
        )}
      >
        {`${date.getHours()}:${
          date.getMinutes() <= 9
            ? `0${date.getMinutes()}`
            : date.getMinutes()
        }`}
        {message.edited ? " (edited)" : ""}
      </div>
    </div>
  );
};

export default ConversationMessage;
