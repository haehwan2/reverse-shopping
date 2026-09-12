import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            productId,
            estimatedWeightGrams,
        } = body;

        if (
            !productId ||
            typeof estimatedWeightGrams !== "number" ||
            estimatedWeightGrams <= 0
        ) {
            return NextResponse.json(
                {
                    error:
                        "상품 ID와 올바른 무게 값이 필요합니다.",
                },
                {
                    status: 400,
                }
            );
        }

        const { error } =
            await supabaseAdmin
                .from("recommended_products")
                .update({
                    estimated_weight_grams:
                        Math.round(
                            estimatedWeightGrams
                        ),
                })
                .eq("id", productId);

        if (error) {
            console.error(
                "Save weight Supabase error:",
                error
            );

            return NextResponse.json(
                {
                    error:
                        "무게 저장 중 오류가 발생했습니다.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Save weight error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "무게 저장 중 오류가 발생했습니다.",
            },
            {
                status: 500,
            }
        );
    }
}