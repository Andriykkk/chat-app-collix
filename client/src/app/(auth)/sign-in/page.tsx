"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { animations } from "@/utils/constants";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  formSchema,
  loginFormSchema,
} from "@/utils/schemas";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

const SignUpPage = () => {
  const [isHover, setIsHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof loginFormSchema>
  ) => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        console.error(result.error);
        toast({
          title: "Invalid credentials",
          description:
            "Please check your credentials and try again",
        });
        setLoading(false);
      } else {
        toast({
          title: "Successfully signed in",
          description: "Redirecting to your dashboard",
        });
        router.push("/conversations");

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: "Please try again",
      });
    }
  };

  return (
    <div className='bg-mainBg w-full h-screen overflow-hidden flex flex-col items-center justify-center py-10 px-4'>
      <motion.div
        className='w-full max-w-[800px]'
        initial={animations.show.initial}
        animate={animations.show.animate}
        transition={animations.show.transition}
      >
        <div className='w-full h-[60vh] flex items-center justify-center relative'>
          <div className='aspect-square h-full relative'>
            <motion.div
              initial={animations.grow_1.initial}
              animate={animations.grow_1.animate}
              transition={animations.grow_1.transition}
              className='bg-mainYellow/20 rounded-full h-full w-full scale-[66%] md:scale-[80%] absolute t-1/2 l-1/2'
              style={{
                filter: "blur(150px)",
              }}
            ></motion.div>
            <div
              className='bg-mainYellow/5 rounded-[40px] w-full w-max-[600px] p-6 pb-10 flex flex-col items-center relative z-1'
              style={{
                boxShadow:
                  "inset 0px 0px 105px 45px rgba(71,46,6,0.2)",
              }}
            >
              <div className='text-2xl font-semibold text-mainYellow'>
                Sign In
              </div>
              <div className='font-light text-mainYellow/70 text-xs'>
                Dont have an account?{" "}
                <Link
                  className='text-mainYellow hover:underline'
                  href='/sign-up'
                >
                  Sign Up
                </Link>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='mt-6 w-full md:px-6'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='mb-6'>
                        <FormControl>
                          <Input
                            className='bg-mainBg/20 border-mainYellow/30 placeholder:text-white/40 text-white  focus-visible:border-mainYellow transition-all '
                            placeholder='Email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='mb-6'>
                        <FormControl>
                          <Input
                            className='bg-mainBg/20 border-mainYellow/30 placeholder:text-white/40 text-white  focus-visible:border-mainYellow transition-all '
                            placeholder='Password'
                            type='password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className='bg-mainYellow text-black text-lg font-semibold py-6 rounded-full w-full transition-all hover:bg-lightYellow hover:-translate-y-1 cursor-pointer w-full'
                    style={{
                      boxShadow: isHover
                        ? " 0px 4px 0px 0px rgb(241, 227, 204)"
                        : "",
                    }}
                    type='submit'
                    onClick={() => {
                      console.log(form.formState.errors);
                    }}
                  >
                    Sign Up
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
