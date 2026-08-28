import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      token: string;
    }>;
  }
) {
  try {
    const { token } = await context.params;

    const { data: quoteRequest, error: requestError } =
      await supabaseAdmin
        .from("quote_requests")
        .select("id")
        .eq("public_token", token)
        .single();

    if (requestError || !quoteRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const { data: messages, error: messagesError } =
      await supabaseAdmin
        .from("request_messages")
        .select("id, sender, message, created_at")
        .eq("request_id", quoteRequest.id)
        .order("created_at", { ascending: true });

    if (messagesError) {
      console.error(messagesError);

      return NextResponse.json(
        { error: "메시지 조회 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: messages ?? [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      token: string;
    }>;
  }
) {
  try {
    const { token } = await context.params;
    const body = await request.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "메시지를 입력해주세요." },
        { status: 400 }
      );
    }

    const { data: quoteRequest, error: requestError } =
      await supabaseAdmin
        .from("quote_requests")
        .select("id")
        .eq("public_token", token)
        .single();

    if (requestError || !quoteRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("request_messages")
      .insert({
        request_id: quoteRequest.id,
        sender: "user",
        message,
      });

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        { error: "메시지 전송 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}