"use client";

import { animations } from "@/utils/constants";
import { motion } from "framer-motion";
import UserAvatar from "../UserAvatar";
import { useSession } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUser } from "@/providers/userProvider";
import { User } from "@prisma/client";
import { getName } from "@/lib/utils";

const SettingsHeader = ({}: {}) => {
  const [session, setSession] = useState(useSession());
  const { user, setUser } = useUser();

  console.log(user);

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
          <div>Good evening, {user && getName(user)}</div>
          <UserAvatar />
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsHeader;
