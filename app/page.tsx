"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";

type RequestType = "link" | "find";

function HomeContent() {
  const [mode, setMode] = useState<RequestType | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [productUrl, setProductUrl] =
    useState("");

  const [requestNote, setRequestNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const [recommendedProductName, setRecommendedProductName] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {
    const requestedMode =
      searchParams.get("mode");

    const requestedUrl =
      searchParams.get("productUrl");

    const productName =
      searchParams.get("productName");

    const productImage =
      searchParams.get("productImage");

    if (requestedMode === "link") {
      setMode("link");

      if (requestedUrl) {
        setProductUrl(requestedUrl);
      }

      if (productName) {
        setRecommendedProductName(productName);
        setRequestNote("");
      }

      if (productImage) {
        setPreview(productImage);
      }
    } else if (
      requestedMode === "find"
    ) {
      setMode("find");
    } else {
      setMode(null);
    }
  }, [searchParams]);

  function openMode(
    newMode: RequestType
  ) {
    setMessage("");

    router.push(
      `/?mode=${newMode}`
    );
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setPreview(
      URL.createObjectURL(file)
    );
  }

  function resetForm() {
    setSelectedFile(null);

    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");
    setProductUrl("");
    setRequestNote("");
    setRecommendedProductName("");
    setQuantity(1);
  }

  async function handleSubmit() {
    if (
      mode === "link" &&
      !productUrl.trim()
    ) {
      setMessage(
        "请输入商品链接。"
      );
      return;
    }

    if (
      mode === "find" &&
      !selectedFile
    ) {
      setMessage(
        "请上传商品图片。"
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      /*
       * 추천상품에서 들어온 경우:
       * preview에 이미 대표 이미지 URL이 있음.
       *
       * 사용자가 직접 이미지를 선택한 경우:
       * 아래에서 Supabase Storage에 업로드하고
       * 새 URL로 교체.
       */
      let imageUrl =
        !selectedFile &&
          preview &&
          !preview.startsWith("blob:")
          ? preview
          : "";

      if (selectedFile) {
        const fileExt =
          selectedFile.name
            .split(".")
            .pop() || "jpg";

        const filePath =
          `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from(
              "product-images"
            )
            .upload(
              filePath,
              selectedFile
            );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(
              "product-images"
            )
            .getPublicUrl(
              filePath
            );

        imageUrl =
          data.publicUrl;
      }

      const publicToken =
        crypto.randomUUID();

      const { error } =
        await supabase
          .from(
            "quote_requests"
          )
          .insert({
            request_type:
              mode,

            image_url:
              imageUrl || null,

            product_url:
              mode === "link"
                ? productUrl.trim() ||
                null
                : null,

            request_note:
              requestNote.trim() ||
              null,

            quantity:
              quantity,

            status:
              "pending",

            public_token:
              publicToken,
          });

      if (error) {
        throw error;
      }

      router.push(
        `/request/${publicToken}`
      );

      resetForm();

      setMessage(
        "申请已提交！"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "提交失败，请稍后再试。"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto min-h-screen max-w-md bg-white px-5 pb-10 pt-6 sm:my-8 sm:min-h-0 sm:rounded-[28px] sm:px-7 sm:shadow-sm">

        {/* Beta */}
        <div className="mb-7 flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight text-gray-950">
            K-Bridge
          </div>

          <div className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            BETA 测试版
          </div>
        </div>

        {/* Hero */}
        <section>
          <div className="mb-3 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            🇰🇷 韩国商品代购
          </div>

          <h1 className="text-[30px] font-bold leading-[1.25] tracking-tight text-gray-950">
            韩国好物，
            <br />
            帮你轻松买到
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-gray-600">
            找商品、看报价、咨询购买，
            <br />
            都可以在这里完成。
          </p>
        </section>

        {!mode && (
          <>
            {/* Main options */}
            <section className="mt-8 space-y-3">

              {/* 인기상품 */}
              <button
                type="button"
                onClick={() => {
                  router.push(
                    "/products"
                  );
                }}
                className="group w-full rounded-2xl border border-orange-100 bg-orange-50 p-5 text-left transition active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-950">
                      🔥 逛逛韩国热门商品
                    </div>

                    <p className="mt-1.5 text-sm leading-5 text-gray-600">
                      不知道买什么？看看最近的人气商品
                    </p>
                  </div>

                  <span className="ml-3 text-xl text-gray-400">
                    ›
                  </span>
                </div>
              </button>

              {/* 링크 구매 */}
              <button
                type="button"
                onClick={() =>
                  openMode("link")
                }
                className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-950">
                      🔗 我已经找到商品了
                    </div>

                    <p className="mt-1.5 text-sm leading-5 text-gray-500">
                      粘贴韩国购物链接，获取购买报价
                    </p>
                  </div>

                  <span className="ml-3 text-xl text-gray-400">
                    ›
                  </span>
                </div>
              </button>

              {/* 상품 찾기 */}
              <button
                type="button"
                onClick={() =>
                  openMode("find")
                }
                className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-950">
                      📷 找不到商品？
                    </div>

                    <p className="mt-1.5 text-sm leading-5 text-gray-500">
                      上传图片和说明，我们帮你人工寻找
                    </p>
                  </div>

                  <span className="ml-3 text-xl text-gray-400">
                    ›
                  </span>
                </div>
              </button>
            </section>

            {/* Process */}
            <section className="mt-8 rounded-2xl bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-900">
                简单三步
              </p>

              <div className="mt-4 flex items-center justify-between text-center">

                <div className="flex-1">
                  <div className="text-xl">
                    🔍
                  </div>

                  <p className="mt-2 text-xs font-medium text-gray-700">
                    提交商品
                  </p>
                </div>

                <div className="text-gray-300">
                  →
                </div>

                <div className="flex-1">
                  <div className="text-xl">
                    💰
                  </div>

                  <p className="mt-2 text-xs font-medium text-gray-700">
                    查看报价
                  </p>
                </div>

                <div className="text-gray-300">
                  →
                </div>

                <div className="flex-1">
                  <div className="text-xl">
                    💬
                  </div>

                  <p className="mt-2 text-xs font-medium text-gray-700">
                    1对1沟通
                  </p>
                </div>

              </div>
            </section>

            <p className="mt-6 text-center text-xs leading-5 text-gray-400">
              测试版暂不支持实际付款和购买
              <br />
              当前所有报价仅用于服务测试
            </p>
          </>
        )}

        {mode && (
          <section className="mt-8">

            {/* 뒤로가기 */}
            <button
              type="button"
              onClick={() => {
                resetForm();
                setMessage("");
                router.push("/");
              }}
              className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-500"
            >
              ← 返回
            </button>

            {/* 제목 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-950">
                {mode === "link"
                  ? "🔗 提交商品链接"
                  : "📷 帮我找商品"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {mode === "link"
                  ? "把韩国购物网站的商品链接发给我们，我们会确认后提供报价。"
                  : "上传你看到的商品图片，我们会人工帮你寻找。"}
              </p>
            </div>

            {/* Image */}
            <div className="mt-7">
              <label className="text-sm font-semibold text-gray-800">
                商品图片

                {mode === "find" && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                )}

                {mode === "link" && (
                  <span className="ml-2 font-normal text-gray-400">
                    选填
                  </span>
                )}
              </label>

              {preview ? (
                <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-3">

                  <img
                    src={preview}
                    alt="商品预览"
                    className="max-h-64 w-full rounded-xl object-contain"
                  />

                  {/* 사용자가 직접 올린 이미지만 삭제 가능 */}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(
                          null
                        );

                        if (
                          preview.startsWith(
                            "blob:"
                          )
                        ) {
                          URL.revokeObjectURL(
                            preview
                          );
                        }

                        setPreview("");
                      }}
                      className="mt-3 text-sm font-medium text-red-500"
                    >
                      删除图片
                    </button>
                  )}
                </div>
              ) : (
                <label className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 transition active:bg-gray-100">

                  <span className="text-2xl">
                    📷
                  </span>

                  <span className="mt-2 text-sm font-medium text-gray-700">
                    点击上传商品图片
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    可从手机相册选择
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* URL */}
            {mode === "link" && (
              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-800">
                  商品链接

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) =>
                    setProductUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
                />
              </div>
            )}

            {/* Note */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-800">
                补充说明

                <span className="ml-2 font-normal text-gray-400">
                  选填
                </span>
              </label>

              <textarea
                value={
                  requestNote
                }
                onChange={(e) =>
                  setRequestNote(
                    e.target.value
                  )
                }
                placeholder={
                  recommendedProductName
                    ? "请输入颜色、尺寸、款式等商品选项"
                    : mode === "find"
                      ? "请尽量详细填写品牌、颜色、尺寸、用途等信息"
                      : "如有颜色、尺寸、款式等要求，请在这里填写"
                }
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-800">
                数量
              </label>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-lg font-bold text-gray-700"
                >
                  −
                </button>

                <div className="flex h-11 min-w-16 items-center justify-center rounded-xl bg-gray-50 px-4 text-base font-semibold text-gray-900">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(20, prev + 1)
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-lg font-bold text-gray-700"
                >
                  +
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                最多可选择 20 件
              </p >
            </div>

            {/* 메시지 */}
            {message && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm ${message ===
                  "申请已提交！"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
                  }`}
              >
                {message}
              </div>
            )}

            {/* 제출 */}
            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-gray-950 px-4 py-4 text-[16px] font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "正在提交..."
                : "提交申请"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              测试版不会产生实际付款或购买
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f7f9]" />}>
      <HomeContent />
    </Suspense>
  );
}