import OpenAI from "openai";
import { NextResponse } from "next/server";

const qwen = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://ws-eil4bq99io9ypcca.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
});

export async function POST(request: Request) {
  try {
    if (!process.env.DASHSCOPE_API_KEY) {
      return NextResponse.json(
        { error: "DASHSCOPE_API_KEY가 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "상품 이미지를 업로드해주세요." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (image.size > maxSize) {
      return NextResponse.json(
        { error: "이미지는 10MB 이하로 업로드해주세요." },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${image.type};base64,${base64Image}`;

    const response = await qwen.chat.completions.create({
      model: "qwen3-vl-plus",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
            {
              type: "text",
              text: `
请分析这张图片中的商品。

这个功能是为了帮助中国用户寻找在韩国销售的商品。

请尽可能准确地识别以下信息：

- 品牌
- 商品名称
- 商品类别
- 容量、数量、颜色、尺寸等规格
- 图片中实际能够看清的文字
- 适合在韩国购物网站搜索的中文关键词

如果无法准确判断具体商品，
请不要强行猜测品牌或商品名称。

所有内容必须使用简体中文回答。

必须只输出以下 JSON 格式。
不要输出 Markdown 或其他说明。

{
  "brand": "",
  "productName": "",
  "category": "",
  "variant": "",
  "visibleText": [],
  "searchKeywords": [],
  "confidence": 0,
  "reason": ""
}

confidence 必须是 0 到 100 之间的数字。
`.trim(),
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content;

    if (typeof text !== "string") {
      throw new Error("Qwen 응답을 읽을 수 없습니다.");
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
    console.error("Product recognition error:", error);

    return NextResponse.json(
      {
        error: "상품 분석 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}