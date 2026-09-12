import OpenAI from "openai";
import { NextResponse } from "next/server";

const qwen = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL:
    "https://ws-eil4bq99io9ypcca.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
});

export async function POST(request: Request) {
  try {
    if (!process.env.DASHSCOPE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "DASHSCOPE_API_KEY가 설정되어 있지 않습니다.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      productName,
      productUrl,
      description,
    } = body;

    if (
      !productName &&
      !productUrl &&
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "상품 정보가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const response =
      await qwen.chat.completions.create({
        model: "qwen3-vl-plus",
        messages: [
          {
            role: "user",
            content: `
请根据下面的商品信息估算商品包含零售包装后的总重量。

商品名称：
${productName || "未知"}

商品链接：
${productUrl || "无"}

商品说明：
${description || "无"}

请尽量给出合理的预估重量。

优先根据商品名称、规格、容量、数量和商品类别判断。

如果没有明确重量，
可以根据同类零售商品的常见重量进行合理估算。

这是AI预估重量，不是实际测量重量。

必须只输出以下JSON格式，
不要输出Markdown或其他说明。

{
  "estimatedWeightGrams": 0,
  "weightReason": ""
}

estimatedWeightGrams 必须是数字，单位为克。

除非完全无法判断商品类型，
否则尽量不要填写0。

weightReason必须使用简体中文，
并简要说明估算依据。
            `.trim(),
          },
        ],
      });

    const text =
      response.choices[0]?.message?.content;

    if (typeof text !== "string") {
      throw new Error(
        "Qwen 응답을 읽을 수 없습니다."
      );
    }

    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Weight estimate error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "무게 추정 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}