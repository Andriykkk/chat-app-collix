"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/providers/userProvider";
import CloudinaryImage from "./CloudinaryImage";

const UserAvatar = ({
  className,
}: {
  className?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser } = useUser();
  const handleSignOut = async () => {
    await signOut();
    router.push("/sing-in");

    toast({
      title: "Successfully signed out",
      description: "Redirecting to sign in page",
    });
  };

  const [isSettingsPage, setIsSettingsPage] =
    useState(false);

  useEffect(() => {
    if (router) {
      if (window.location.href.includes("/settings")) {
        setIsSettingsPage(true);
      } else {
        setIsSettingsPage(false);
      }
    }
  }, [router]);

  const handleLinkCopy = async () => {
    console.log(process.env.NEXT_URL);
    console.log(process.env.NEXTAUTH_URL);

    if (!window)
      return toast({
        title: "Error",
        description: "Invitation link not found",
      });

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    if (!user?.invitationLink)
      return toast({
        title: "Error",
        description: "Invitation link not found",
      });

    await navigator.clipboard
      .writeText(
        `${protocol}//${hostname}${
          port ? `:${port}` : ""
        }/invite/${user?.invitationLink}`
      )
      .then(() => {
        toast({
          title: "Link copied",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err,
        });
      });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className='w-[32px] h-[32px] object-cover'
        >
          <Image
            src={
              user?.profilePicture
                ? `https://res.cloudinary.com/dklmnmveq/image/upload/v1718615508/${user?.profilePicture}.png`
                : "userAvatar.svg"
            }
            alt='profile image'
            width={32}
            height={32}
            className={cn("rounded-full", className)}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button onClick={handleLinkCopy}>
              Invitation Link
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            disabled={isSettingsPage}
            className={`cursor-pointer ${
              isSettingsPage ? "bg-accent" : ""
            }`}
          >
            <div>Settings</div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <button className='text-red-500'>
              Log Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatar;
