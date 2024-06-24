"use client";

import SettingsHeader from "@/components/headers/SettingsHeader";
import SettingsForm from "@/components/settingsForm";
import { useUser } from "@/providers/userProvider";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SettingsPage = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  useEffect(() => {
    function fetchSession() {
      getSession().then((session) => {
        if (!session) {
          router.push("/");
        }
      });
    }

    fetchSession();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='w-full min-h-screen bg-black/95 flex flex-col '>
      <SettingsHeader />
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
