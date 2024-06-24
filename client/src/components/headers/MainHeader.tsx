"use client";

import { animations } from "@/utils/constants";
import { motion } from "framer-motion";
import UserAvatar from "../UserAvatar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const MainHeader = () => {
  const [session, setSession] = useState(useSession());

  return (
    <motion.div
      initial={animations.showUp.initial}
      animate={animations.showUp.animate}
      transition={animations.showUp.transition}
      className='fixed top-0 left-0 z-50 w-full flex items-center justify-between text-white p-4 '
    >
      <div>
        <div className='text-mainYellow/70 text-xs'>
          Welcome Oji <span className='text-white'>🖐️</span>
        </div>
        <div className='text-2xl font-semibold'>Collix</div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4 text-sm font-medium'>
          <div>
            Good evening,{" "}
            {session?.data?.user?.name
              ? session?.data?.user.name
              : session?.data?.user?.email &&
                session?.data?.user?.email.split("@")[0]}
          </div>
          <UserAvatar />
        </div>
      </div>
    </motion.div>
  );
};

export default MainHeader;
