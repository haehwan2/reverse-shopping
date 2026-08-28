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

  const expectedSession = createHmac(
    "sha256",
    adminPassword
  )
    .update("admin-session")
    .digest("hex");

  return session === expectedSession;
}

export async function GET() {
  const isAuthenticated =
    await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("recommended_products")
    .select("*")
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "상품 조회 실패" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    products: data ?? [],
  });
}

export async function POST(
  request: Request
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
    const body = await request.json();

    const {
      name,
      image_url,
      detail_images,
      product_url,
      seller_name,
      price_krw,
      description,
      sort_order,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          error: "상품명이 필요합니다.",
        },
        { status: 400 }
      );
    }

    const safeDetailImages =
      Array.isArray(detail_images)
        ? detail_images.filter(
          (url) =>
            typeof url === "string" &&
            url.trim()
        )
        : [];

    const { data, error } =
      await supabaseAdmin
        .from("recommended_products")
        .insert({
          name: name.trim(),

          image_url:
            image_url || null,

          detail_images:
            safeDetailImages,

          product_url:
            product_url || null,

          seller_name:
            seller_name || null,

          price_krw:
            price_krw ?? null,

          description:
            description || null,

          is_active: true,

          sort_order:
            sort_order ?? 0,
        })
        .select()
        .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "상품 추가 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      product: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "서버 오류" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request
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
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "상품 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if ("name" in body) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {
        return NextResponse.json(
          {
            error: "상품명이 필요합니다.",
          },
          { status: 400 }
        );
      }

      updates.name = body.name.trim();
    }

    if ("image_url" in body) {
      updates.image_url =
        typeof body.image_url === "string" &&
          body.image_url.trim()
          ? body.image_url.trim()
          : null;
    }

    if ("detail_images" in body) {
      updates.detail_images =
        Array.isArray(body.detail_images)
          ? body.detail_images.filter(
            (url: unknown) =>
              typeof url === "string" &&
              url.trim()
          )
          : [];
    }

    if ("product_url" in body) {
      updates.product_url =
        typeof body.product_url === "string" &&
          body.product_url.trim()
          ? body.product_url.trim()
          : null;
    }

    if ("seller_name" in body) {
      updates.seller_name =
        typeof body.seller_name === "string" &&
          body.seller_name.trim()
          ? body.seller_name.trim()
          : null;
    }

    if ("price_krw" in body) {
      updates.price_krw =
        body.price_krw === null ||
          body.price_krw === ""
          ? null
          : Number(body.price_krw);
    }

    if ("description" in body) {
      updates.description =
        typeof body.description === "string" &&
          body.description.trim()
          ? body.description.trim()
          : null;
    }

    if ("sort_order" in body) {
      updates.sort_order =
        Number(body.sort_order) || 0;
    }

    if ("is_active" in body) {
      updates.is_active =
        Boolean(body.is_active);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error: "수정할 내용이 없습니다.",
        },
        { status: 400 }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("recommended_products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: "상품 수정 실패",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "서버 오류" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
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
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "상품 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabaseAdmin
        .from("recommended_products")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "상품 삭제 실패",
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
      { error: "서버 오류" },
      { status: 500 }
    );
  }
}