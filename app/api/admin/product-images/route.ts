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

export async function POST(request: Request) {
  const isAuthenticated =
    await isAdminAuthenticated();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const files = formData
      .getAll("files")
      .filter(
        (item): item is File =>
          item instanceof File
      );

    if (files.length === 0) {
      return NextResponse.json(
        { error: "이미지가 없습니다." },
        { status: 400 }
      );
    }

    if (files.length > 9) {
      return NextResponse.json(
        {
          error:
            "이미지는 최대 9장까지 업로드할 수 있습니다.",
        },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error:
              "이미지 파일만 업로드할 수 있습니다.",
          },
          { status: 400 }
        );
      }

      const extension =
        file.name.split(".").pop() || "jpg";

      const fileName =
        `recommended/${crypto.randomUUID()}.${extension}`;

      const buffer =
        Buffer.from(
          await file.arrayBuffer()
        );

      const { error } =
        await supabaseAdmin.storage
          .from("product-images")
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
          });

      if (error) {
        console.error(error);

        return NextResponse.json(
          {
            error:
              "이미지 업로드에 실패했습니다.",
          },
          { status: 500 }
        );
      }

      const { data } =
        supabaseAdmin.storage
          .from("product-images")
          .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return NextResponse.json({
      urls,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "서버 오류" },
      { status: 500 }
    );
  }
}