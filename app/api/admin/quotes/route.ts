import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("admin quotes error:", error);

    return NextResponse.json(
      { error: "견적 요청 조회 실패" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    requests: data ?? [],
  });
}

export async function PATCH(request: Request) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      id,
      product_price,
      domestic_shipping,
      international_shipping,
      service_fee,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "요청 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const productPrice = product_price ?? 0;
    const domesticShipping = domestic_shipping ?? 0;
    const internationalShipping = international_shipping ?? 0;
    const serviceFee = service_fee ?? 0;

    const totalPrice =
      productPrice +
      domesticShipping +
      internationalShipping +
      serviceFee;

    const { error } = await supabaseAdmin
      .from("quote_requests")
      .update({
        product_price: productPrice,
        domestic_shipping: domesticShipping,
        international_shipping: internationalShipping,
        service_fee: serviceFee,
        total_price: totalPrice,
        status: status ?? "quoted",
      })
      .eq("id", id);

    if (error) {
      console.error("quote update error:", error);

      return NextResponse.json(
        { error: "견적 저장 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      total_price: totalPrice,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "서버 오류" },
      { status: 500 }
    );
  }
}