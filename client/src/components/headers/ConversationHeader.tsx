"use client";

import { animations } from "@/utils/constants";
import { motion } from "framer-motion";
import UserAvatar from "../UserAvatar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getName } from "@/lib/utils";
import { useUser } from "@/providers/userProvider";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CloudinaryImage from "../CloudinaryImage";
import { User } from "@prisma/client";

const ConversationHeader = ({
  companion,
}: {
  companion: User;
}) => {
  const { user } = useUser();

  return (
    <motion.div
      initial={animations.showUp.initial}
      animate={animations.showUp.animate}
      transition={animations.showUp.transition}
      className='fixed top-0 left-0 z-50 w-full flex items-center justify-between text-white p-4 '
    >
      <div>
        <Link
          href={"/conversations"}
          className='text-mainYellow/70 text-xl w-10 h-10 bg-mainYellow/15 rounded-full flex items-center justify-center cursor-pointer hover:bg-mainYellow/30 hover:text-white transition-all'
        >
          <FaArrowLeft />
        </Link>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4 text-sm font-medium'>
          <div>{getName(companion)}</div>
          {!companion.profilePicture ? (
            <Image
              className='w-10 h-10 rounded-full'
              src='/userAvatar.svg'
              alt='profile image'
              width={24}
              height={24}
            />
          ) : (
            <CloudinaryImage
              className='w-14 h-14 rounded-full'
              id={companion.profilePicture}
              alt='profile image'
              width={32}
              height={32}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationHeader;
