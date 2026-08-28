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

    const { data, error } = await supabaseAdmin
      .from("quote_requests")
      .select(`
        id,
        image_url,
        product_url,
        request_note,
        request_type,
        quantity,
        status,
        created_at,
        product_price,
        domestic_shipping,
        international_shipping,
        service_fee,
        total_price
      `)
      .eq("public_token", token)
      .single();

    if (error) {
      console.error("request api error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      request: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}