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
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
      .from("request_messages")
      .select("id, sender, message, created_at")
      .eq("request_id", Number(id))
      .order("created_at", { ascending: true });

    if (error) {
      console.error("admin messages error:", error);

      return NextResponse.json(
        { error: "메시지 조회 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: data ?? [],
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