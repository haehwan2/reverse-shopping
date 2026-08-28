"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
    id: number;
    name: string;
    image_url: string | null;
    detail_images: string[] | null;
    product_url: string | null;
    seller_name: string | null;
    price_krw: number | null;
    description: string | null;
};

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
              description
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

    function requestQuote() {
        if (!product) return;

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
                    </p >
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
                            router.push("/products")
                        }
                        className="text-sm font-medium text-gray-500"
                    >
                        ← 返回
                    </button>

                    <div className="mt-10 rounded-2xl bg-white p-6 text-center">
                        <p className="text-sm text-red-500">
                            {error ||
                                "找不到该商品。"}
                        </p >
                    </div>
                </div>
            </main>
        );
    }

    const detailImages =
        product.detail_images ?? [];

    return (
        <main className="min-h-screen bg-[#f6f7f9] pb-32">
            <div className="mx-auto max-w-md">

                {/* 상단 */}
                <div className="flex items-center justify-between px-5 py-5">
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/products")
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
                            src={product.image_url}
                            alt={product.name}
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
                                </p >
                            </div>
                        </div>
                    )}
                </section>

                {/* 기본 상품 정보 */}
                <section className="bg-white px-5 pb-6 pt-5">
                    {product.seller_name && (
                        <p className="text-sm font-medium text-gray-400">
                            {product.seller_name}
                        </p >
                    )}

                    <h1 className="mt-2 text-2xl font-bold leading-8 text-gray-950">
                        {product.name}
                    </h1>

                    {product.price_krw !== null && (
                        <div className="mt-5">
                            <p className="text-2xl font-bold tracking-tight text-gray-950">
                                ₩
                                {product.price_krw.toLocaleString()}
                            </p >

                            <p className="mt-1 text-xs text-gray-400">
                                韩国参考售价 · 实际价格可能发生变化
                            </p >
                        </div>
                    )}
                </section>

                {/* 상세 이미지 */}
                {detailImages.length > 0 && (
                    <section className="mt-3 bg-white py-6">
                        <h2 className="px-5 text-lg font-bold text-gray-950">
                            商品详情
                        </h2>

                        <div className="mt-5 space-y-2">
                            {detailImages.map(
                                (image, index) => (
                                    <img
                                        key={`${image}-${index}`}
                                        src={image}
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
                            {product.description}
                        </p >
                    </section>
                )}

                {/* Option guide */}
                <section className="mt-3 bg-white px-5 py-6">
                    <h2 className="text-lg font-bold text-gray-950">
                        商品选项
                    </h2>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                        <p className="text-sm leading-6 text-gray-600">
                            商品的颜色、尺寸、款式等选项可能会根据韩国销售页面发生变化。
                        </p >

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            申请报价时，请在补充说明中填写你想要的商品选项。
                        </p >

                        <p className="mt-3 text-xs text-gray-400">
                            例如：蓝色 / M码 / 2件
                        </p >
                    </div>
                </section>

                {/* 안내 */}
                <section className="mt-3 bg-white px-5 py-6">
                    <div className="rounded-2xl bg-orange-50 p-4">
                        <p className="text-sm font-semibold text-gray-900">
                            💡 想购买这个商品？
                        </p >

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            提交报价申请后，我们会确认韩国实际售价、
                            商品选项及相关费用。
                        </p >
                    </div>
                </section>

                <div className="px-5 py-7 text-center">
                    <p className="text-xs text-gray-400">
                        🧪 测试版暂不支持实际付款和购买
                    </p >
                </div>
            </div>

            {/* 하단 고정 견적 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
                <div className="mx-auto max-w-md">
                    <button
                        type="button"
                        onClick={requestQuote}
                        className="w-full rounded-2xl bg-black px-4 py-4 text-base font-bold text-white"
                    >
                        申请报价
                    </button>
                </div>
            </div>
        </main>
    );
}