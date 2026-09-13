"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

type ProductOption = {
  name: string;
  values: string[];
};

type Product = {
  id: number;
  name: string;
  image_url: string | null;
  detail_images: string[] | null;
  product_url: string | null;
  seller_name: string | null;

  price_krw: number | null;
  price_adjustment_cny: number | null;
  list_price_cny: number | null;

  description: string | null;
  options: ProductOption[] | null;
  estimated_weight_grams: number | null;
};

function estimateShippingFee(
  weightGrams: number
) {
  if (weightGrams <= 0) {
    return null;
  }

  const weightKg =
    weightGrams / 1000;

  // 포트폴리오용 참고 배송요율
  // 첫 1kg: ¥38
  // 이후 1kg마다: ¥12
  if (weightKg <= 1) {
    return 38;
  }

  return (
    38 +
    Math.ceil(
      weightKg - 1
    ) *
    12
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const id =
    params.id as string;

  const [
    product,
    setProduct,
  ] =
    useState<Product | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    exchangeRate,
    setExchangeRate,
  ] =
    useState<number | null>(
      null
    );

  const [
    estimatedWeightGrams,
    setEstimatedWeightGrams,
  ] =
    useState<number | null>(
      null
    );

  const [
    weightReason,
    setWeightReason,
  ] =
    useState("");

  /*
   * 옵션별 수량
   *
   * 이제 옵션 이름/값 자체를 key로 사용하지 않고
   * 화면상의 groupIndex + valueIndex를 사용한다.
   *
   * 예:
   * "0::0" = 첫 번째 옵션의 첫 번째 선택지
   * "0::1" = 첫 번째 옵션의 두 번째 선택지
   */
  const [
    optionQuantities,
    setOptionQuantities,
  ] =
    useState<
      Record<string, number>
    >({});

  // =========================
  // 상품 불러오기
  // =========================

  useEffect(() => {
    async function loadProduct() {
      try {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              "recommended_products"
            )
            .select(
              `
                id,
                name,
                image_url,
                detail_images,
                product_url,
                seller_name,
                price_krw,
                price_adjustment_cny,
                list_price_cny,
                description,
                options,
                estimated_weight_grams
              `
            )
            .eq(
              "id",
              Number(id)
            )
            .eq(
              "is_active",
              true
            )
            .single();

        if (error) {
          console.error(
            error
          );

          setError(
            "商品信息加载失败，请稍后再试。"
          );

          return;
        }

        setProduct(
          data as Product
        );

        // 상품이 바뀌면 옵션 수량 초기화
        setOptionQuantities(
          {}
        );
      } catch (error) {
        console.error(
          error
        );

        setError(
          "商品信息加载失败，请稍后再试。"
        );
      } finally {
        setLoading(
          false
        );
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  // =========================
  // 환율
  // =========================

  useEffect(() => {
    async function loadExchangeRate() {
      try {
        const response =
          await fetch(
            "/api/exchange-rate"
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Failed to fetch exchange rate"
          );
        }

        const data =
          await response.json();

        setExchangeRate(
          data.rate
        );
      } catch (error) {
        console.error(
          "Exchange rate load error:",
          error
        );
      }
    }

    loadExchangeRate();
  }, []);

  // =========================
  // AI 무게 추정
  // =========================

  useEffect(() => {
    async function estimateWeight() {
      if (!product) {
        return;
      }

      /*
       * DB에 이미 무게가 있으면
       * AI를 다시 호출하지 않는다.
       */
      if (
        product.estimated_weight_grams !==
        null &&
        product.estimated_weight_grams >
        0
      ) {
        setEstimatedWeightGrams(
          product
            .estimated_weight_grams
        );

        setWeightReason(
          "使用已保存的商品预估重量"
        );

        return;
      }

      /*
       * DB에 무게가 없는 상품만
       * AI 무게 추정
       */
      try {
        const response =
          await fetch(
            "/api/weight-estimate",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    productName:
                      product.name,

                    productUrl:
                      product.product_url,

                    description:
                      product.description,
                  }
                ),
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Failed to estimate weight"
          );
        }

        const data =
          await response.json();

        if (
          data.success &&
          data.result
            ?.estimatedWeightGrams >
          0
        ) {
          const estimatedWeight =
            data.result
              .estimatedWeightGrams;

          setEstimatedWeightGrams(
            estimatedWeight
          );

          setWeightReason(
            data.result
              .weightReason ||
            ""
          );

          /*
           * AI가 계산한 무게를 DB에 저장
           */
          try {
            const saveResponse =
              await fetch(
                "/api/products/save-weight",
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body:
                    JSON.stringify(
                      {
                        productId:
                          product.id,

                        estimatedWeightGrams:
                          estimatedWeight,
                      }
                    ),
                }
              );

            if (
              !saveResponse.ok
            ) {
              console.error(
                "Failed to save estimated weight"
              );
            }
          } catch (
          saveError
          ) {
            console.error(
              "Save estimated weight error:",
              saveError
            );
          }
        }
      } catch (error) {
        console.error(
          "Weight estimate error:",
          error
        );
      }
    }

    estimateWeight();
  }, [product]);

  // =========================
  // 옵션 수량
  // =========================

  function getOptionKey(
    groupIndex: number,
    valueIndex: number
  ) {
    return `${groupIndex}::${valueIndex}`;
  }

  function getOptionQuantity(
    groupIndex: number,
    valueIndex: number
  ) {
    const key =
      getOptionKey(
        groupIndex,
        valueIndex
      );

    return (
      optionQuantities[
      key
      ] ?? 0
    );
  }

  function changeOptionQuantity(
    groupIndex: number,
    valueIndex: number,
    change: number
  ) {
    const key =
      getOptionKey(
        groupIndex,
        valueIndex
      );

    setOptionQuantities(
      (prev) => {
        const current =
          prev[key] ?? 0;

        const currentTotal =
          Object.values(
            prev
          ).reduce(
            (
              sum,
              quantity
            ) =>
              sum +
              quantity,
            0
          );

        // 전체 최대 20개
        if (
          change > 0 &&
          currentTotal >=
          20
        ) {
          return prev;
        }

        const next =
          Math.max(
            0,
            current +
            change
          );

        return {
          ...prev,
          [key]: next,
        };
      }
    );
  }

  const totalOptionQuantity =
    Object.values(
      optionQuantities
    ).reduce(
      (
        sum,
        quantity
      ) =>
        sum +
        quantity,
      0
    );

  // =========================
  // 로딩
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f7f9]">
        <div className="mx-auto max-w-md px-5 py-10">
          <p className="text-center text-sm text-gray-400">
            商品加载中...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // 오류
  // =========================

  if (
    error ||
    !product
  ) {
    return (
      <main className="min-h-screen bg-[#f6f7f9]">
        <div className="mx-auto max-w-md px-5 py-10">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/products"
              )
            }
            className="text-sm font-medium text-gray-500"
          >
            ← 返回
          </button>

          <div className="mt-10 rounded-2xl bg-white p-6 text-center">
            <p className="text-sm text-red-500">
              {error ||
                "找不到该商品。"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const detailImages =
    product.detail_images ??
    [];

  /*
   * DB에 과거 잘못 저장된 중복 선택지가 있어도
   * 고객 화면에서는 자동으로 중복 제거한다.
   *
   * 예:
   * ["浅米色", "浅米色", "黑色"]
   *
   * ↓
   *
   * ["浅米色", "黑色"]
   */
  const optionGroups =
    (
      product.options ??
      []
    )
      .map(
        (group) => ({
          name:
            group.name.trim(),

          values:
            Array.from(
              new Set(
                (
                  group.values ??
                  []
                )
                  .map(
                    (
                      value
                    ) =>
                      value.trim()
                  )
                  .filter(
                    Boolean
                  )
              )
            ),
        })
      )
      .filter(
        (group) =>
          group.name
            .length >
          0 &&
          group.values
            .length >
          0
      );

  // =========================
  // 중국 판매 가격
  // =========================

  const basePriceCny =
    product.price_krw !== null &&
      exchangeRate !== null
      ? Math.round(
        product.price_krw *
        exchangeRate
      )
      : null;

  const priceAdjustmentCny =
    product.price_adjustment_cny !==
      null &&
      product.price_adjustment_cny !==
      undefined
      ? Number(
        product.price_adjustment_cny
      )
      : 0;

  const salePriceCny =
    basePriceCny !== null
      ? Math.max(
        0,
        Math.round(
          basePriceCny +
          priceAdjustmentCny
        )
      )
      : null;

  const listPriceCny =
    product.list_price_cny !==
      null &&
      product.list_price_cny !==
      undefined
      ? Number(
        product.list_price_cny
      )
      : null;

  const discountPercent =
    salePriceCny !== null &&
      listPriceCny !== null &&
      listPriceCny >
      salePriceCny &&
      listPriceCny > 0
      ? Math.round(
        ((listPriceCny -
          salePriceCny) /
          listPriceCny) *
        100
      )
      : null;

  // =========================
  // 견적 요청
  // =========================

  async function requestQuote() {
    if (!product) {
      return;
    }

    if (
      optionGroups.length > 0 &&
      totalOptionQuantity === 0
    ) {
      alert("请至少选择一个商品选项");
      return;
    }

    try {
      setSubmitting(true);

      const selectedItems: string[] = [];

      optionGroups.forEach(
        (group, groupIndex) => {
          group.values.forEach(
            (value, valueIndex) => {
              const quantity =
                getOptionQuantity(
                  groupIndex,
                  valueIndex
                );

              if (quantity > 0) {
                selectedItems.push(
                  `${group.name}: ${value} × ${quantity}`
                );
              }
            }
          );
        }
      );

      const requestNoteParts: string[] = [];

      requestNoteParts.push(
        `推荐商品：${product.name}`
      );

      if (selectedItems.length > 0) {
        requestNoteParts.push(
          `商品选项：\n${selectedItems.join("\n")}`
        );
      }

      const publicToken =
        crypto.randomUUID();

      const { error } =
        await supabase
          .from("quote_requests")
          .insert({
            request_type: "link",

            image_url:
              product.image_url || null,

            product_url:
              product.product_url || null,

            request_note:
              requestNoteParts.join("\n\n"),

            quantity:
              totalOptionQuantity > 0
                ? totalOptionQuantity
                : 1,

            status: "pending",

            public_token:
              publicToken,
          });

      if (error) {
        throw error;
      }

      router.push(
        `/request/${publicToken}`
      );
    } catch (error) {
      console.error(error);

      alert(
        "提交失败，请稍后再试。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] pb-32">
      <div className="mx-auto max-w-md">

        {/* 상단 */}
        <div className="flex items-center justify-between px-5 py-5">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/products"
              )
            }
            className="text-sm font-medium text-gray-500"
          >
            ← 返回
          </button>

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            BETA 测试版
          </span>
        </div>

        {/* 대표 이미지 */}
        <section className="bg-white">

          {product.image_url ? (
            <img
              src={
                product.image_url
              }
              alt={
                product.name
              }
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-gray-100">
              <div className="text-center">

                <div className="text-4xl">
                  📦
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  暂无商品图片
                </p>

              </div>
            </div>
          )}

        </section>

        {/* 기본 상품 정보 */}
        <section className="bg-white px-5 pb-6 pt-5">

          {product.seller_name && (
            <p className="text-sm font-medium text-gray-400">
              {
                product.seller_name
              }
            </p>
          )}

          <h1 className="mt-2 text-2xl font-bold leading-8 text-gray-950">
            {product.name}
          </h1>

          {product.price_krw !== null && (
            <div className="mt-5">

              {salePriceCny !== null && (
                <>
                  <div className="flex flex-wrap items-end gap-2">

                    <p className="text-3xl font-bold tracking-tight text-gray-950">
                      ¥
                      {salePriceCny.toLocaleString()}
                    </p >

                    {discountPercent !==
                      null && (
                        <span className="mb-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                          {discountPercent}% OFF
                        </span>
                      )}

                  </div>

                  {listPriceCny !== null &&
                    listPriceCny >
                    salePriceCny && (
                      <p className="mt-1 text-sm text-gray-400 line-through">
                        ¥
                        {listPriceCny.toLocaleString()}
                      </p >
                    )}
                </>
              )}

              <p className="mt-2 text-sm text-gray-500">
                ₩
                {product.price_krw.toLocaleString()}{" "}
                韩国参考售价
              </p >

              {exchangeRate !== null && (
                <p className="mt-1 text-xs text-gray-400">
                  按当前汇率自动换算 ·
                  实际价格可能随汇率变化
                </p >
              )}

            </div>
          )}

          {/* AI 무게 */}
          {estimatedWeightGrams !==
            null &&
            estimatedWeightGrams >
            0 && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-900">
                  <span className="font-semibold">
                    ⚖️ AI预估重量：
                  </span>

                  {estimatedWeightGrams >=
                    1000
                    ? `约 ${(
                      estimatedWeightGrams /
                      1000
                    ).toFixed(
                      1
                    )}kg`
                    : `约 ${estimatedWeightGrams}g`}
                </p>

                {weightReason && (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {
                      weightReason
                    }
                  </p>
                )}

                <p className="mt-1 text-[11px] text-gray-400">
                  仅为AI估算，实际重量可能不同
                </p>

                {estimateShippingFee(
                  estimatedWeightGrams
                ) !==
                  null && (
                    <div className="mt-3 border-t border-gray-200 pt-3">

                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">
                          🚚 预计国际运费：
                        </span>{" "}
                        约 ¥
                        {estimateShippingFee(
                          estimatedWeightGrams
                        )}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        按参考运费规则估算 ·
                        实际运费以物流确认结果为准
                      </p>

                    </div>
                  )}

              </div>
            )}

        </section>

        {/* 상품 옵션 */}
        {optionGroups.length >
          0 && (
            <section className="mt-3 bg-white px-5 py-6">

              <h2 className="text-lg font-bold text-gray-950">
                选择商品选项
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                可以分别选择不同选项的数量
              </p>

              <div className="mt-5 space-y-7">

                {optionGroups.map(
                  (
                    group,
                    groupIndex
                  ) => (
                    <div
                      key={`${group.name}-${groupIndex}`}
                    >

                      <p className="text-sm font-semibold text-gray-900">
                        {
                          group.name
                        }
                      </p>

                      <div className="mt-3 space-y-3">

                        {group.values.map(
                          (
                            value,
                            valueIndex
                          ) => {
                            const quantity =
                              getOptionQuantity(
                                groupIndex,
                                valueIndex
                              );

                            return (
                              <div
                                key={`${groupIndex}-${valueIndex}-${value}`}
                                className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${quantity >
                                  0
                                  ? "border-gray-950 bg-gray-50"
                                  : "border-gray-200 bg-white"
                                  }`}
                              >

                                <span className="min-w-0 flex-1 pr-3 text-sm font-medium text-gray-900">
                                  {
                                    value
                                  }
                                </span>

                                <div className="flex shrink-0 items-center gap-3">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      changeOptionQuantity(
                                        groupIndex,
                                        valueIndex,
                                        -1
                                      )
                                    }
                                    disabled={
                                      quantity ===
                                      0
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-lg font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    −
                                  </button>

                                  <span className="min-w-5 text-center text-sm font-bold text-gray-950">
                                    {
                                      quantity
                                    }
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      changeOptionQuantity(
                                        groupIndex,
                                        valueIndex,
                                        1
                                      )
                                    }
                                    disabled={
                                      totalOptionQuantity >=
                                      20
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-lg font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    +
                                  </button>

                                </div>
                              </div>
                            );
                          }
                        )}

                      </div>
                    </div>
                  )
                )}

              </div>

              {/* 총 수량 */}
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-950 px-4 py-4 text-white">

                <span className="text-sm font-medium">
                  合计
                </span>

                <span className="font-bold">
                  {
                    totalOptionQuantity
                  }{" "}
                  件
                </span>

              </div>

              <p className="mt-2 text-right text-xs text-gray-400">
                最多可选择 20 件
              </p>

            </section>
          )}

        {/* 상세 이미지 */}
        {detailImages.length >
          0 && (
            <section className="mt-3 bg-white py-6">

              <h2 className="px-5 text-lg font-bold text-gray-950">
                商品详情
              </h2>

              <div className="mt-5 space-y-2">

                {detailImages.map(
                  (
                    image,
                    index
                  ) => (
                    <img
                      key={`${image}-${index}`}
                      src={
                        image
                      }
                      alt={`${product.name} ${index + 1
                        }`}
                      className="w-full object-contain"
                    />
                  )
                )}

              </div>

            </section>
          )}

        {/* 상품 설명 */}
        {product.description && (
          <section className="mt-3 bg-white px-5 py-6">

            <h2 className="text-lg font-bold text-gray-950">
              商品介绍
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
              {
                product.description
              }
            </p>

          </section>
        )}

        {/* 옵션 없는 상품 */}
        {optionGroups.length ===
          0 && (
            <section className="mt-3 bg-white px-5 py-6">

              <h2 className="text-lg font-bold text-gray-950">
                商品选项
              </h2>

              <div className="mt-4 rounded-2xl bg-gray-50 p-4">

                <p className="text-sm leading-6 text-gray-600">
                  如果该商品有颜色、尺寸或款式等选项，
                  可以在报价申请时填写在补充说明中。
                </p>

              </div>

            </section>
          )}

        {/* 안내 */}
        <section className="mt-3 bg-white px-5 py-6">

          <div className="rounded-2xl bg-orange-50 p-4">

            <p className="text-sm font-semibold text-gray-900">
              💡 想购买这个商品？
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              提交报价申请后，我们会确认韩国实际售价、
              商品选项及相关费用。
            </p>

          </div>

        </section>

        <div className="px-5 py-7 text-center">

          <p className="text-xs text-gray-400">
            🧪 测试版暂不支持实际付款和购买
          </p>

        </div>

      </div>

      {/* 하단 고정 견적 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">

        <div className="mx-auto max-w-md">

          <button
            type="button"
            onClick={requestQuote}
            disabled={submitting}
            className="w-full rounded-2xl bg-black px-4 py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "正在提交..."
              : "申请报价"}
          </button>

        </div>

      </div>
    </main>
  );
}