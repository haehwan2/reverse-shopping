import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ token: string }>;
  }
) {
  try {
    const { token } = await context.params;

    const body = await request.json();

    const {
      purchase_intent,
      most_useful,
      request_ease,
      quote_clarity,
      reuse_intent,
      improvement,
    } = body;

    if (
      !purchase_intent ||
      !most_useful ||
      !request_ease ||
      !quote_clarity ||
      !reuse_intent
    ) {
      return NextResponse.json(
        {
          error: "필수 항목을 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const { data: quoteRequest, error: quoteError } =
      await supabaseAdmin
        .from("quote_requests")
        .select("id, status")
        .eq("public_token", token)
        .single();

    if (quoteError || !quoteRequest) {
      return NextResponse.json(
        {
          error: "요청을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    const { data: existingFeedback } =
      await supabaseAdmin
        .from("request_feedback")
        .select("id")
        .eq("request_id", quoteRequest.id)
        .maybeSingle();

    if (existingFeedback) {
      return NextResponse.json(
        {
          error: "이미 피드백을 제출했습니다.",
        },
        { status: 409 }
      );
    }

    const { error: insertError } =
      await supabaseAdmin
        .from("request_feedback")
        .insert({
          request_id: quoteRequest.id,
          purchase_intent,
          most_useful,
          request_ease,
          quote_clarity,
          reuse_intent,
          improvement:
            typeof improvement === "string" &&
            improvement.trim()
              ? improvement.trim()
              : null,
        });

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        {
          error: "피드백 저장에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}