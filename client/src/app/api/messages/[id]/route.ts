import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,

  { params }: { params: { id: string } }
) {
  try {
    const { id: messageId } = params;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const updatedMessage = await prisma.messages.update({
      where: { id: messageId },
      data: { content, edited: true },
    });

    return NextResponse.json(
      { updatedMessage },
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

export async function DELETE(
  req: NextRequest,

  { params }: { params: { id: string } }
) {
  try {
    const { id: messageId } = params;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const updatedMessage = await prisma.messages.update({
      where: { id: messageId },
      data: {
        content: null,
        media_url: null,
        deleted: true,
      },
    });

    return NextResponse.json(
      { updatedMessage },
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
