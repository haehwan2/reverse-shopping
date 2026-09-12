import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function isAdminAuthenticated() {
  const adminPassword =
    process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  const cookieStore =
    await cookies();

  const session =
    cookieStore.get(
      "admin_session"
    )?.value;

  if (!session) {
    return false;
  }

  const expectedSession =
    createHmac(
      "sha256",
      adminPassword
    )
      .update(
        "admin-session"
      )
      .digest("hex");

  return (
    session ===
    expectedSession
  );
}

function parseNullableNumber(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return null;
  }

  return numberValue;
}

function parseAdjustment(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return 0;
  }

  return numberValue;
}

// =========================
// 상품 목록
// =========================

export async function GET() {
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

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        "recommended_products"
      )
      .select("*")
      .order(
        "sort_order",
        {
          ascending: true,
        }
      );

  if (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        error:
          "상품 조회 실패",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    products:
      data ?? [],
  });
}

// =========================
// 상품 추가
// =========================

export async function POST(
  request: Request
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
    const body =
      await request.json();

    const {
      name,
      image_url,
      detail_images,
      product_url,
      seller_name,
      price_krw,
      price_adjustment_cny,
      list_price_cny,
      description,
      sort_order,
      options,
    } = body;

    if (
      !name ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "상품명이 필요합니다.",
        },
        {
          status: 400,
        }
      );
    }

    const safeDetailImages =
      Array.isArray(
        detail_images
      )
        ? detail_images.filter(
            (
              url
            ) =>
              typeof url ===
                "string" &&
              url.trim()
          )
        : [];

    const parsedPriceKrw =
      parseNullableNumber(
        price_krw
      );

    const parsedAdjustment =
      parseAdjustment(
        price_adjustment_cny
      );

    const parsedListPrice =
      parseNullableNumber(
        list_price_cny
      );

    if (
      parsedPriceKrw !==
        null &&
      parsedPriceKrw < 0
    ) {
      return NextResponse.json(
        {
          error:
            "한국 판매 가격은 0 이상이어야 합니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      parsedListPrice !==
        null &&
      parsedListPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "중국 정가는 0 이상이어야 합니다.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "recommended_products"
        )
        .insert({
          name:
            name.trim(),

          image_url:
            image_url ||
            null,

          detail_images:
            safeDetailImages,

          product_url:
            product_url ||
            null,

          seller_name:
            seller_name ||
            null,

          price_krw:
            parsedPriceKrw,

          price_adjustment_cny:
            parsedAdjustment,

          list_price_cny:
            parsedListPrice,

          description:
            description ||
            null,

          options:
            Array.isArray(
              options
            )
              ? options
              : [],

          is_active:
            true,

          sort_order:
            sort_order ??
            0,
        })
        .select()
        .single();

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            "상품 추가 실패",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      product: data,
    });
  } catch (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        error:
          "서버 오류",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// 상품 수정
// =========================

export async function PATCH(
  request: Request
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
    const body =
      await request.json();

    const {
      id,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "상품 ID가 필요합니다.",
        },
        {
          status: 400,
        }
      );
    }

    const updates:
      Record<
        string,
        unknown
      > = {};

    if (
      "name" in body
    ) {
      if (
        typeof body.name !==
          "string" ||
        !body.name.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "상품명이 필요합니다.",
          },
          {
            status: 400,
          }
        );
      }

      updates.name =
        body.name.trim();
    }

    if (
      "image_url" in body
    ) {
      updates.image_url =
        typeof body.image_url ===
          "string" &&
        body.image_url.trim()
          ? body.image_url.trim()
          : null;
    }

    if (
      "detail_images" in
      body
    ) {
      updates.detail_images =
        Array.isArray(
          body.detail_images
        )
          ? body.detail_images.filter(
              (
                url: unknown
              ) =>
                typeof url ===
                  "string" &&
                url.trim()
            )
          : [];
    }

    if (
      "product_url" in body
    ) {
      updates.product_url =
        typeof body.product_url ===
          "string" &&
        body.product_url.trim()
          ? body.product_url.trim()
          : null;
    }

    if (
      "seller_name" in body
    ) {
      updates.seller_name =
        typeof body.seller_name ===
          "string" &&
        body.seller_name.trim()
          ? body.seller_name.trim()
          : null;
    }

    if (
      "price_krw" in body
    ) {
      const parsed =
        parseNullableNumber(
          body.price_krw
        );

      if (
        parsed !== null &&
        parsed < 0
      ) {
        return NextResponse.json(
          {
            error:
              "한국 판매 가격은 0 이상이어야 합니다.",
          },
          {
            status: 400,
          }
        );
      }

      updates.price_krw =
        parsed;
    }

    if (
      "price_adjustment_cny" in
      body
    ) {
      updates.price_adjustment_cny =
        parseAdjustment(
          body.price_adjustment_cny
        );
    }

    if (
      "list_price_cny" in
      body
    ) {
      const parsed =
        parseNullableNumber(
          body.list_price_cny
        );

      if (
        parsed !== null &&
        parsed < 0
      ) {
        return NextResponse.json(
          {
            error:
              "중국 정가는 0 이상이어야 합니다.",
          },
          {
            status: 400,
          }
        );
      }

      updates.list_price_cny =
        parsed;
    }

    if (
      "description" in
      body
    ) {
      updates.description =
        typeof body.description ===
          "string" &&
        body.description.trim()
          ? body.description.trim()
          : null;
    }

    if (
      "options" in body
    ) {
      updates.options =
        Array.isArray(
          body.options
        )
          ? body.options
          : [];
    }

    if (
      "sort_order" in body
    ) {
      updates.sort_order =
        Number(
          body.sort_order
        ) || 0;
    }

    if (
      "is_active" in body
    ) {
      updates.is_active =
        Boolean(
          body.is_active
        );
    }

    if (
      Object.keys(
        updates
      ).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "수정할 내용이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "recommended_products"
        )
        .update(
          updates
        )
        .eq(
          "id",
          id
        )
        .select()
        .single();

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            "상품 수정 실패",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        error:
          "서버 오류",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// 상품 삭제
// =========================

export async function DELETE(
  request: Request
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
    const body =
      await request.json();

    const {
      id,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "상품 ID가 필요합니다.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      error,
    } =
      await supabaseAdmin
        .from(
          "recommended_products"
        )
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            "상품 삭제 실패",
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
      error
    );

    return NextResponse.json(
      {
        error:
          "서버 오류",
      },
      {
        status: 500,
      }
    );
  }
}