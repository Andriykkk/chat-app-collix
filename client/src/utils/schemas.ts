import { z } from "zod";

const passwordSchema = z
  .string()
  .min(2, {
    message: "Password must be at least 2 characters long",
  })
  .max(50, {
    message:
      "Password must be no more than 50 characters long",
  });

export const formSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message:
          "Username must be at least 2 characters long",
      })
      .max(50, {
        message:
          "Username must be no more than 50 characters long",
      }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .max(50, {
        message:
          "Email must be no more than 50 characters long",
      }),
    password: z
      .string()
      .min(2, {
        message:
          "Password must be at least 2 characters long",
      })
      .max(50, {
        message:
          "Password must be no more than 50 characters long",
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(50, {
      message:
        "Email must be no more than 50 characters long",
    }),
  password: z
    .string()
    .min(2, {
      message:
        "Password must be at least 2 characters long",
    })
    .max(50, {
      message:
        "Password must be no more than 50 characters long",
    }),
});

export const settingsFormSchema = z.object({
  firstName: z.string().max(50, {
    message:
      "First name must be no more than 50 characters long",
  }),
  lastName: z.string().max(50, {
    message:
      "Last name must be no more than 50 characters long",
  }),
  username: z
    .string()
    .min(2, {
      message:
        "Username must be at least 2 characters long",
    })
    .max(50, {
      message:
        "Username must be no more than 50 characters long",
    }),
  profilePicture: z.string(),
});

export const messageFormSchema = z.object({
  content: z.string().max(50),
});
