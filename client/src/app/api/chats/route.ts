import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user1, user2 } = await req.json();

    if (!user1 || !user2) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const existingChat = await prisma.chat.findMany({
      where: {
        OR: [
          {
            AND: [
              { user1_id: user1.id },
              { user2_id: user2.id },
            ],
          },
          {
            AND: [
              { user1_id: user2.id },
              { user2_id: user1.id },
            ],
          },
        ],
      },
    });
    console.log("existingChat", existingChat);

    if (existingChat.length > 0) {
      return NextResponse.json(
        { chat: existingChat },
        { status: 200 }
      );
    }

    const newChat = await prisma.chat.create({
      data: {
        user1: {
          connect: { id: user1.id },
        },
        user2: {
          connect: { id: user2.id },
        },
        messages: {
          create: [],
        },
      },
    });
    console.log("newChat", newChat);

    return NextResponse.json({ newChat }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const chatId = req.nextUrl.searchParams.get("id");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        user1: true,
        user2: true,
        messages: true,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
