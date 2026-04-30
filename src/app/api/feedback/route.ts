import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { feedbackStore, Feedback } from "@/lib/feedbackStore";

export async function GET() {
  const sortedFeedback = [...feedbackStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sortedFeedback);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    const trimmedName = name?.trim() || "";
    const trimmedMessage = message?.trim() || "";

    if (!trimmedName) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 200) {
      return NextResponse.json(
        { error: "Message must be between 10 and 200 characters" },
        { status: 400 }
      );
    }

    const isDuplicate = feedbackStore.some(
      (f) => f.name === trimmedName && f.message === trimmedMessage
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: "Duplicate feedback already exists" },
        { status: 409 }
      );
    }

    const newFeedback: Feedback = {
      id: uuidv4(),
      name: trimmedName,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    feedbackStore.push(newFeedback);

    return NextResponse.json(newFeedback, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}