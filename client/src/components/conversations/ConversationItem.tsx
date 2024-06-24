import React from "react";
import UserAvatar from "../UserAvatar";
import CloudinaryImage from "../CloudinaryImage";
import { User } from "@prisma/client";
import Image from "next/image";
import { getName } from "@/lib/utils";
import Link from "next/link";

const ConversationItem = ({
  user,
  chatId,
  messages,
}: any) => {
  console.log(messages[0]);

  return (
    <Link
      href={`/conversation/${chatId}`}
      className='flex gap-4 w-full relative pb-8'
    >
      <div className='absolute left-0 bottom-4 w-full h-[2px] bg-gradient-to-r from-gray-100/30 via-gray-200 to-gray-100/30'></div>
      {!user.profilePicture ? (
        <Image
          className='w-14 h-14 rounded-full'
          src='userAvatar.svg'
          alt='profile image'
          width={32}
          height={32}
        />
      ) : (
        <CloudinaryImage
          className='w-14 h-14 rounded-full'
          id={
            user.profilePicture
              ? user.profilePicture
              : "userAvatar.svg"
          }
          alt='profile image'
          width={32}
          height={32}
        />
      )}

      <div className='flex flex-col justify-around'>
        <div className='font-medium text-left'>
          {getName(user)}
        </div>
        <div className='text-[0.8rem] text-gray-400 text-left flex gap-2 items-center'>
          {messages.length > 0 && !messages[0].read ? (
            <div className='w-2 h-2 rounded-full bg-mainYellow animate-pulse'></div>
          ) : (
            ""
          )}
          {messages[0]?.content ? (
            messages[0]?.content
          ) : (
            <div className='truncate max-w-[200px]'>
              No messages yet
            </div>
          )}
        </div>
        <div className='absolute top-0 right-2 text-[0.8rem] text-gray-400'>
          12:35
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;
