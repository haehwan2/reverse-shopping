import { NextResponse } from "next/server";
import OpenAI from "openai";

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
          success: false,
          error: "DASHSCOPE_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const keyword =
      typeof body.keyword === "string"
        ? body.keyword.trim()
        : "";

    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: "请输入商品关键词。",
        },
        { status: 400 }
      );
    }

    const response = await qwen.responses.create({
      model: "qwen3.7-max",

      input: `
你是一个帮助中国用户寻找韩国商品的购物助手。

请通过网络搜索寻找与下面关键词最相似的韩国商品：

${keyword}

第一目标是寻找与关键词对应的同一款商品。
只有在无法确认完全一致的商品时，才可以推荐高度相似的商品。

优先搜索：
- 29CM
- SSF Shop
- Musinsa
- 韩国品牌官方网站

如果商品属于美妆或护肤品，再优先搜索：
- Olive Young
- 韩国美妆品牌官方网站

最多推荐 3 个最相关的商品。

请用简体中文说明：

1. 品牌
2. 商品名称
3. 商品特点
4. 参考价格
5. 韩国商品详情页链接

如果确认是同一款商品，请明确写：
“确认到高度匹配的商品”

如果无法确认完全一致，请明确写：
“未确认到完全一致的商品，以下为相似商品”

非常重要：

- 不要自己编造网址。
- 不要猜测或拼接商品网址。
- 优先使用网络搜索中实际找到的商品详情页链接。
- 如果无法确认链接，请不要强行提供。
- 优先提供具体商品详情页，而不是商城首页或搜索页。
- 不要把相似商品说成同一款商品。
- 商品准确度比推荐数量更重要。
- 不需要返回 JSON。
- 用适合手机阅读的方式整理。
      `,

      tools: [
        {
          type: "web_search",
        },
      ],
    } as any);

    const result =
      response.output_text?.trim() ||
      "暂时没有找到合适的韩国商品。";

    return NextResponse.json({
      success: true,
      result,
      products: [],
    });
  } catch (error) {
    console.error("Product search error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "商品搜索失败，请稍后再试。",
      },
      { status: 500 }
    );
  }
}