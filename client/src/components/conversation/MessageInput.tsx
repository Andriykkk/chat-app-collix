import React from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FormField, FormItem } from "../ui/form";
import { useParams } from "next/navigation";

const MessageInput = ({ form, socket }: any) => {
  const { conversationId } = useParams();
  const handleFocus = () => {
    socket.emit(
      "focusInput",
      JSON.stringify({
        conversationId,
      })
    );
  };

  const handleBlur = () => {
    socket.emit(
      "blurInput",
      JSON.stringify({
        conversationId,
      })
    );
  };

  return (
    <div className='w-full pb-6 px-4 absolute bottom-0 left-0 w-full '>
      <div className='w-full bg-grayBg h-[66px] rounded-full flex px-3 items-center'>
        <div className='cursor-pointer min-w-[50px] h-[50px] rounded-full bg-[#D9CCF5] flex justify-center items-center text-[#8F6BDB] group transition-all hover:text-[#7c58c9] hover:bg-[#c8b5f1]'>
          <FaMicrophoneAlt className='text-3xl group-hover:scale-115 transition-all' />
        </div>
        <div className='w-full h-full'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <input
                onFocus={handleFocus}
                type='text'
                placeholder='Enter message...'
                className='h-full w-full px-4 bg-transparent outline-none text-lg text-mainBg'
                {...field}
                onBlur={handleBlur}
              />
            )}
          />
        </div>
        <button
          type='submit'
          className='cursor-pointer min-w-[50px] h-[50px] rounded-full bg-[#E3F3FF] flex justify-center items-center text-[#6EB1E3] group transition-all hover:text-[#4c85b1] hover:bg-[#a5d2f4]'
        >
          <IoSend className='text-2xl group-hover:scale-115 transition-all' />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
