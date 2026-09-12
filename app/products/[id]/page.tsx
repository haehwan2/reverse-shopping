"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    description: string | null;
    options: ProductOption[] | null;
    estimated_weight_grams: number | null;
};

function estimateShippingFee(weightGrams: number) {
    if (weightGrams <= 0) return null;

    const weightKg = weightGrams / 1000;

    // 포트폴리오용 참고 배송요율
    // 첫 1kg: ¥38
    // 이후 1kg마다: ¥12
    if (weightKg <= 1) {
        return 38;
    }

    return 38 + Math.ceil(weightKg - 1) * 12;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [product, setProduct] =
        useState<Product | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [exchangeRate, setExchangeRate] =
        useState<number | null>(null);

    const [
        estimatedWeightGrams,
        setEstimatedWeightGrams,
    ] = useState<number | null>(null);

    const [weightReason, setWeightReason] =
        useState("");

    const [
        selectedOptions,
        setSelectedOptions,
    ] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadProduct() {
            try {
                const { data, error } =
                    await supabase
                        .from("recommended_products")
                        .select(
                            `
                id,
                name,
                image_url,
                detail_images,
                product_url,
                seller_name,
                price_krw,
                description,
                options,
                estimated_weight_grams
              `
                        )
                        .eq("id", Number(id))
                        .eq("is_active", true)
                        .single();

                if (error) {
                    console.error(error);

                    setError(
                        "商品信息加载失败，请稍后再试。"
                    );

                    return;
                }

                setProduct(data);

                setSelectedOptions({});
            } catch (error) {
                console.error(error);

                setError(
                    "商品信息加载失败，请稍后再试。"
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadProduct();
        }
    }, [id]);

    useEffect(() => {
        async function loadExchangeRate() {
            try {
                const response = await fetch(
                    "/api/exchange-rate"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch exchange rate"
                    );
                }

                const data =
                    await response.json();

                setExchangeRate(data.rate);
            } catch (error) {
                console.error(
                    "Exchange rate load error:",
                    error
                );
            }
        }

        loadExchangeRate();
    }, []);

    useEffect(() => {
        async function estimateWeight() {
            if (!product) return;

            /*
             * DB에 이미 무게가 저장되어 있으면
             * Qwen API를 다시 호출하지 않고
             * 저장된 값을 바로 사용한다.
             */
            if (
                product.estimated_weight_grams !== null &&
                product.estimated_weight_grams > 0
            ) {
                setEstimatedWeightGrams(
                    product.estimated_weight_grams
                );

                setWeightReason(
                    "使用已保存的商品预估重量"
                );

                return;
            }

            /*
             * DB에 무게가 없는 상품만
             * AI를 사용해서 무게를 추정한다.
             */
            try {
                const response = await fetch(
                    "/api/weight-estimate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            productName:
                                product.name,

                            productUrl:
                                product.product_url,

                            description:
                                product.description,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to estimate weight"
                    );
                }

                const data =
                    await response.json();

                if (
                    data.success &&
                    data.result?.estimatedWeightGrams
                ) {
                    const estimatedWeight =
                        data.result.estimatedWeightGrams;

                    setEstimatedWeightGrams(
                        estimatedWeight
                    );

                    setWeightReason(
                        data.result.weightReason || ""
                    );

                    try {
                        const saveResponse = await fetch(
                            "/api/products/save-weight",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },
                                body: JSON.stringify({
                                    productId: product.id,
                                    estimatedWeightGrams:
                                        estimatedWeight,
                                }),
                            }
                        );

                        if (!saveResponse.ok) {
                            console.error(
                                "Failed to save estimated weight"
                            );
                        }
                    } catch (saveError) {
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

    function selectOption(
        optionName: string,
        value: string
    ) {
        setSelectedOptions((prev) => ({
            ...prev,
            [optionName]: value,
        }));
    }

    function requestQuote() {
        if (!product) return;

        const optionGroups =
            product.options ?? [];

        // 옵션이 있는 상품이면 모두 선택했는지 검사
        const missingOption =
            optionGroups.find(
                (group) =>
                    !selectedOptions[
                    group.name
                    ]
            );

        if (missingOption) {
            alert(
                `请选择${missingOption.name}`
            );

            return;
        }

        const query =
            new URLSearchParams({
                mode: "link",

                productName:
                    product.name,
            });

        if (product.product_url) {
            query.set(
                "productUrl",
                product.product_url
            );
        }

        if (product.image_url) {
            query.set(
                "productImage",
                product.image_url
            );
        }

        if (optionGroups.length > 0) {
            const optionText =
                optionGroups
                    .map(
                        (group) =>
                            `${group.name}: ${selectedOptions[
                            group.name
                            ]
                            }`
                    )
                    .join(" / ");

            query.set(
                "productOption",
                optionText
            );
        }

        router.push(
            `/?${query.toString()}`
        );
    }

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

    if (error || !product) {
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
        product.detail_images ?? [];

    const optionGroups =
        product.options ?? [];

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

                    {product.price_krw !==
                        null && (
                            <div className="mt-5">
                                {exchangeRate !==
                                    null && (
                                        <p className="text-2xl font-bold tracking-tight text-gray-950">
                                            约 ¥
                                            {Math.round(
                                                product.price_krw *
                                                exchangeRate
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                <p className="mt-1 text-sm text-gray-500">
                                    ₩
                                    {product.price_krw.toLocaleString()}{" "}
                                    韩国参考售价
                                </p>

                                {exchangeRate !==
                                    null && (
                                        <p className="mt-1 text-xs text-gray-400">
                                            按当前汇率估算 ·
                                            实际价格可能发生变化
                                        </p>
                                    )}
                            </div>
                        )}

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
                                ) !== null && (
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
                                请先选择商品选项后再申请报价
                            </p>

                            <div className="mt-5 space-y-6">
                                {optionGroups.map(
                                    (group) => (
                                        <div
                                            key={
                                                group.name
                                            }
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {
                                                        group.name
                                                    }
                                                </p>

                                                {selectedOptions[
                                                    group.name
                                                ] && (
                                                        <span className="text-xs text-gray-400">
                                                            已选择：
                                                            {
                                                                selectedOptions[
                                                                group
                                                                    .name
                                                                ]
                                                            }
                                                        </span>
                                                    )}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {group.values.map(
                                                    (
                                                        value
                                                    ) => {
                                                        const selected =
                                                            selectedOptions[
                                                            group
                                                                .name
                                                            ] ===
                                                            value;

                                                        return (
                                                            <button
                                                                key={
                                                                    value
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    selectOption(
                                                                        group.name,
                                                                        value
                                                                    )
                                                                }
                                                                className={
                                                                    selected
                                                                        ? "rounded-xl border border-black bg-black px-4 py-2.5 text-sm font-semibold text-white"
                                                                        : "rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
                                                                }
                                                            >
                                                                {
                                                                    value
                                                                }
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
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

                {/* 옵션 없는 상품 안내 */}
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
                        onClick={
                            requestQuote
                        }
                        className="w-full rounded-2xl bg-black px-4 py-4 text-base font-bold text-white"
                    >
                        申请报价
                    </button>
                </div>
            </div>
        </main>
    );
}