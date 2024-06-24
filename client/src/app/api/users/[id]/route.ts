import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const {
      firstName,
      lastName,
      username,
      profilePicture,
    } = await req.json();

    if (!id || !username) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: {
        f_name: firstName,
        l_name: lastName,
        username,
        profilePicture,
      },
    });

    user.password = "";

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        f_name: true,
        l_name: true,
        username: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
