import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.frankfurter.dev/v2/rate/KRW/CNY",
      {
        next: { revalidate: 21600 }, // 6시간마다 갱신
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();

    return NextResponse.json({
      rate: data.rate,
    });
  } catch (error) {
    console.error("Exchange rate error:", error);

    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}