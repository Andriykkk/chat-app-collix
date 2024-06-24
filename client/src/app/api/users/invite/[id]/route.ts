import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: {
        invitationLink: randomBytes(32).toString("hex"),
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
    const { id: inviteId } = params;

    if (!inviteId) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { invitationLink: inviteId },
      select: {
        id: true,
        email: true,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
