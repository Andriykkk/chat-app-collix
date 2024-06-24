"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { animations } from "@/utils/constants";
import { settingsFormSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { z } from "zod";
import Container from "./Container";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/providers/userProvider";
import { useRouter } from "next/navigation";
import CloudinaryImage from "./CloudinaryImage";
import { Separator } from "./ui/separator";

const SettingsForm = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [preview, setPreview] = useState<null | string>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingLink, setChangingLink] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const userContext = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleUsers = async (email: string) => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users", {
          params: { email },
        });
        const user = response.data.user;
        userContext.setUser({
          ...userContext.user,
          ...user,
        });

        setUser(response.data.user);
        setValue(
          "firstName",
          user?.f_name ? user?.f_name : ""
        );
        setValue(
          "lastName",
          user?.l_name ? user?.l_name : ""
        );
        setValue(
          "username",
          user?.username ? user?.username : ""
        );
        setValue(
          "profilePicture",
          user?.profilePicture ? user?.profilePicture : ""
        );
        setPreview(null);
      } catch (error: any) {
        console.error(
          "Error fetching user:",
          error.response?.data?.error || error.message
        );
      }

      setLoading(false);
      router.refresh();
    };

    if (session?.user?.email)
      handleUsers(session?.user?.email);
  }, []);

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      profilePicture: "",
    },
  });

  const {
    formState: { isSubmitting },
    setValue,
  } = form;

  const handleUploadSuccess = (result: any) => {
    const { secure_url, public_id } = result.info;
    setValue("profilePicture", public_id);
    setPreview(secure_url);
    setUploading(false);
  };

  const onSubmit = async (data: any) => {
    if (!user || !user.id) return;
    try {
      const response = await axios.post(
        `/api/users/${user.id}`,
        data
      );
      if (response.status === 200) {
        console.log(
          "User updated successfully:",
          response.data.user
        );
        toast({
          title: "User updated successfully",
        });
      } else {
        console.error(
          "Failed to update user:",
          response.data.error
        );
        toast({
          title: "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(
        "Error updating user:",
        error.response?.data?.error || error.message
      );
      toast({
        title: "Error updating user",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    if (!user || !user.id) return;

    setChangingLink(true);
    try {
      const response = await axios.post(
        `/api/users/invite/${user.id}`
      );

      if (response.status === 200) {
        console.log(
          "Link updated successfully:",
          response.data.user
        );
        toast({
          title: "Link updated successfully",
        });
        console.log(response);

        if (
          userContext?.user?.id &&
          response?.data?.user?.invitationLink
        ) {
          userContext.setUser({
            ...userContext.user,
            invitationLink:
              response?.data?.user?.invitationLink,
          });

          if (!window) return;

          const protocol = window.location.protocol;
          const hostname = window.location.hostname;
          const port = window.location.port;

          await navigator.clipboard.writeText(
            `${protocol}//${hostname}${
              port ? `:${port}` : ""
            }/invite/${
              response?.data?.user?.invitationLink
            }`
          );
        }
      } else {
        console.error("Failed to update invitation link");
        toast({
          title: "Failed to update invitation link",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating invitation link");
      toast({
        title: "Error updating invitation link",
        variant: "destructive",
      });
    }

    setChangingLink(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className='h-full overflow-hidden'>
      <motion.div
        className='md:text-center flex h-full flex-col pt-6 relative overflow-auto pb-6'
        initial={animations.show.initial}
        animate={animations.show.animate}
        transition={animations.show.transition}
      >
        <div className='text-2xl font-semibold px-4 pb-2 relative z-20'>
          Account Settings
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 w-full px-4'
          >
            <FormItem className='mb-6'>
              <FormLabel className='text-lg'>
                Profile Picture
              </FormLabel>
              <FormControl>
                <div className='w-[200px] h-[200px] relative rounded-xl bg-mainYellow relative'>
                  <CldUploadButton
                    uploadPreset='la88acb3'
                    onSuccess={handleUploadSuccess}
                    className='bg-red-500 absolute top-0 left-0 z-10 w-full h-full opacity-0 cursor-pointer'
                    onClick={() => setUploading(true)}
                  />
                  {preview && !uploading && (
                    <img src={preview} alt='Profile' />
                  )}
                  <Input
                    type='hidden'
                    accept='image/*'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  />
                  {preview || user?.profilePicture ? (
                    <div className='preview'>
                      <Image
                        src={
                          preview ||
                          `https://res.cloudinary.com/dklmnmveq/image/upload/v1718615508/${user?.profilePicture}.png`
                        }
                        alt='Preview'
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                  ) : (
                    <div className='w-[200px] h-[200px] flex flex-col items-center justify-center gap-2'>
                      <FaCloudDownloadAlt className='w-14 h-14' />
                      <p className='text-center text-sm'>
                        Drag & Drop or Click to Upload
                      </p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='mb-6'>
                  <FormLabel className='text-lg'>
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=' border-black/40 border-2 px-2 py-4 h-[52px] rounded-xl placeholder:text-black/30 focus-visible:border-mainYellow transition-all text-xl'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem className='mb-6'>
                  <FormLabel className='text-lg'>
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=' border-black/40 border-2 px-2 py-4 h-[52px] rounded-xl placeholder:text-black/30 focus-visible:border-mainYellow transition-all text-xl'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='mb-6'>
                  <FormLabel className='text-lg'>
                    UserName
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=' border-black/40 border-2 px-2 py-4 h-[52px] rounded-xl placeholder:text-black/30 focus-visible:border-mainYellow transition-all text-xl'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='bg-mainYellow text-black text-lg font-semibold py-6 rounded-full w-full transition-all hover:bg-lightYellow hover:-translate-y-1 cursor-pointer w-full'
              disabled={isSubmitting}
              type='submit'
            >
              Save
            </Button>
          </form>
        </Form>
        <Separator className='my-6' />
        <div className='mx-4'>
          <Button
            className='bg-mainYellow text-black text-lg font-semibold py-6 rounded-full w-full transition-all hover:bg-lightYellow hover:-translate-y-1 cursor-pointer w-full '
            onClick={handleCopyLink}
            disabled={changingLink}
          >
            Change and Copy Invitation Link
          </Button>
        </div>
      </motion.div>
    </Container>
  );
};

export default SettingsForm;
