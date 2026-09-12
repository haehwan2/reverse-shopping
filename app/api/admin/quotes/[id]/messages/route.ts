import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function isAdminAuthenticated() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) {
    return false;
  }

  const expectedSession = createHmac("sha256", adminPassword)
    .update("admin-session")
    .digest("hex");

  return session === expectedSession;
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const isAuthenticated =
    await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } =
      await context.params;

    const requestId =
      Number(id);

    // 1. 메시지 조회
    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "request_messages"
        )
        .select(
          `
          id,
          sender,
          message,
          created_at,
          admin_read
          `
        )
        .eq(
          "request_id",
          requestId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {
      console.error(
        "admin messages error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "메시지 조회 실패",
        },
        { status: 500 }
      );
    }

    // 2. 관리자가 채팅을 열었으므로
    // 사용자 메시지를 읽음 처리
    const {
      error: readError,
    } =
      await supabaseAdmin
        .from(
          "request_messages"
        )
        .update({
          admin_read: true,
        })
        .eq(
          "request_id",
          requestId
        )
        .eq(
          "sender",
          "user"
        )
        .eq(
          "admin_read",
          false
        );

    if (readError) {
      console.error(
        "admin message read update error:",
        readError
      );
    }

    return NextResponse.json({
      messages: data ?? [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "메시지를 입력해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("request_messages")
      .insert({
        request_id: Number(id),
        sender: "admin",
        message,
        admin_read: true,
      });

    if (error) {
      console.error("admin message insert error:", error);

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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const isAuthenticated =
    await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    const unread =
      body.unread === true;

    if (!unread) {
      return NextResponse.json(
        {
          error:
            "잘못된 요청입니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 해당 요청의 사용자 메시지를
     * 다시 안 읽은 상태로 변경
     */
    const { error } =
      await supabaseAdmin
        .from(
          "request_messages"
        )
        .update({
          admin_read: false,
        })
        .eq(
          "request_id",
          Number(id)
        )
        .eq(
          "sender",
          "user"
        );

    if (error) {
      console.error(
        "mark unread error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "안 읽음 처리 실패",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}