import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className='h-screen pt-20 overflow-hidden'>
      <div
        className={cn(
          "bg-white rounded-t-[40px] overflow-hidden h-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
