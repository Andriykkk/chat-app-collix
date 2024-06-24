import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    let skip = Number(searchParams.get("skip"));

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    if (!skip) {
      skip = 0;
    }

    const messages = await prisma.messages.findMany({
      where: { chat_id: chatId },
      select: {
        id: true,
        content: true,
        media_url: true,
        deleted: true,
        edited: true,
        read: true,
        user_id: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: 20,
    });

    if (!messages) {
      return NextResponse.json(
        { error: "Messages not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { chatId, userId, content, mediaUrl } =
      await req.json();

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: "Chat ID and User ID are required" },
        { status: 400 }
      );
    }

    if (!content && !mediaUrl) {
      return NextResponse.json(
        {
          error: "Message content or media URL is required",
        },
        { status: 400 }
      );
    }

    const newMessage = await prisma.messages.create({
      data: {
        chat_id: chatId,
        user_id: userId,
        content: content || null,
        media_url: mediaUrl || null,
      },
    });

    return NextResponse.json(
      { newMessage },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { chatId, userId } = await req.json();

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: "Chat ID and User ID are required" },
        { status: 400 }
      );
    }

    const updatedMessages =
      await prisma.messages.updateMany({
        where: {
          chat_id: chatId,
          user_id: userId,
          read: false,
        },
        data: {
          read: true,
        },
      });

    return NextResponse.json(
      { updatedMessages },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
