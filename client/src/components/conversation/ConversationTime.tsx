"use client";

import React, { useEffect, useRef, useState } from "react";

const ConversationTime = ({
  type = "time",
  date,
}: {
  type?: string;
  date: Date;
}) => {
  const formattedDate = new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className='flex justify-center h-[36px]'>
      <div className='p-4 py-2 sticky rounded-[30px] mx-auto text-sm bg-red-100'>
        {formattedDate}
      </div>
    </div>
  );
};

export default ConversationTime;
