"use client";

import { Button } from "@/components/ui/button";
import { animations } from "@/utils/constants";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StartPage = () => {
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();
  useEffect(() => {
    function fetchSession() {
      getSession().then((session) => {
        if (session) {
          router.push("/conversations");
        }
      });
    }

    fetchSession();
  }, []);
  return (
    <div className='bg-mainBg w-full h-screen overflow-hidden flex flex-col items-center justify-between py-10 px-4'>
      <div className='w-full max-w-[800px]'>
        <div className='w-full h-[60vh] flex items-center justify-center relative'>
          <div className='aspect-square h-full relative'>
            <motion.div
              className={`after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:aspect-square after:h-[20%] md:after:h-[25%] after:border-2 after:border-mainYellow/15 after:rounded-full
		  before:content-[""] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:aspect-square before:h-[40%] md:before:h-[50%] before:border-2 before:border-mainYellow/10 before:rounded-full`}
              initial={animations.grow_2.initial}
              animate={animations.grow_2.animate}
              transition={animations.grow_2.transition}
            ></motion.div>
            <motion.div
              initial={animations.grow_3.initial}
              animate={animations.grow_3.animate}
              transition={animations.grow_3.transition}
              className='before:content-[""] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:aspect-square before:h-[80%] md:before:h-[90%] before:border-2 before:border-mainYellow/5 before:rounded-full'
            ></motion.div>
            <motion.div
              initial={animations.grow_1.initial}
              animate={animations.grow_1.animate}
              transition={animations.grow_1.transition}
              className='bg-mainYellow/20 rounded-full h-full scale-[66%] md:scale-[80%] relative'
              style={{
                filter: "blur(150px)",
              }}
            ></motion.div>
            <motion.div
              className='top-[20%] right-0 translate-x-[65%] absolute md:-right-10'
              initial={animations.ball.initial}
              animate={animations.ball.animate}
              transition={animations.ball.transition}
            >
              <Image
                src={"/Ball.png"}
                alt='ball'
                width={300}
                height={300}
              />
            </motion.div>
            <motion.div
              className='top-0 right-0 -translate-y-[65%] absolute  md:-right-10'
              initial={animations.torus.initial}
              animate={animations.torus.animate}
              transition={animations.torus.transition}
            >
              <Image
                src={"/Torus.png"}
                alt='Torus'
                width={250}
                height={250}
              />
            </motion.div>
            <motion.div
              className='top-[10%] left-0 -translate-x-[65%] absolute rotate-[-100deg]  md:-left-10'
              initial={animations.spiral.initial}
              animate={animations.spiral.animate}
              transition={animations.spiral.transition}
            >
              <Image
                src={"/Spiral.png"}
                alt='Spiral'
                width={400}
                height={400}
              />
            </motion.div>
          </div>
        </div>
        <motion.div
          className='md:text-center'
          initial={animations.show.initial}
          animate={animations.show.animate}
          transition={animations.show.transition}
        >
          <div className='text-3xl text-white font-medium mb-6'>
            Chat Your Way
          </div>
          <div className='text-[0.8rem] text-gray-400 mb-8'>
            Callix is your new way to connect with friends{" "}
            <br />
            Experience seamless communication with a sleek
            interface, robust features, and crystal-clear
            voice and video calls.
          </div>
          <Button
            onClick={() => router.push("/sign-up")}
            className='bg-mainYellow text-black text-xl font-semibold py-7 rounded-full w-full sm:w-[300px] transition-all hover:bg-lightYellow hover:-translate-y-1'
            style={{
              boxShadow: isHover
                ? " 0px 4px 0px 0px rgb(241, 227, 204)"
                : "",
            }}
            onMouseEnter={() => {
              setIsHover(true);
            }}
            onMouseLeave={() => {
              setIsHover(false);
            }}
          >
            Start Chatting Now!
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StartPage;
