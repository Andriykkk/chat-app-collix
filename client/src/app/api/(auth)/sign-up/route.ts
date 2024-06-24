import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, confirmPassword } =
      await req.json();

    if (
      !username ||
      !email ||
      !password ||
      password !== confirmPassword
    ) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const invitationLink = randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        invitationLink,
      },
    });

    user.password = "";

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
