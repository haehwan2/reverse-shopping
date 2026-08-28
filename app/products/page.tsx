"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  image_url: string | null;
  product_url: string | null;
  seller_name: string | null;
  price_krw: number | null;
  description: string | null;
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("recommended_products")
        .select(
          "id, name, image_url, product_url, seller_name, price_krw, description"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error(error);
        setError("商品加载失败，请稍后再试。");
      } else {
        setProducts(data ?? []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  function selectProduct(product: Product) {
    router.push(`/products/${product.id}`);
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto max-w-md px-5 pb-12 pt-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-medium text-gray-500"
          >
            ← 首页
          </button>

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            BETA 测试版
          </span>
        </div>

        {/* Title */}
        <section className="mt-7">
          <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
            🔥 韩国人气推荐
          </div>

          <h1 className="mt-3 text-[28px] font-bold tracking-tight text-gray-950">
            韩国热门商品
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            不知道买什么？先看看最近推荐的韩国商品。
          </p >
        </section>

        {/* Guide */}
        <section className="mt-6 rounded-2xl bg-white p-4 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3">
            <div className="text-xl">💡</div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                看中商品后可以直接申请报价
              </p >

              <p className="mt-1 text-xs leading-5 text-gray-400">
                点击商品后，商品链接会自动带入申请页面。
              </p >
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              正在加载商品...
            </p >
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 px-4 py-4 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p >
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white px-5 py-10 text-center shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
            <div className="text-3xl">🛍️</div>

            <p className="mt-3 font-semibold text-gray-900">
              暂时没有推荐商品
            </p >

            <p className="mt-1 text-sm text-gray-400">
              稍后再来看看吧。
            </p >
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => selectProduct(product)}
                className="overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition active:scale-[0.99] disabled:cursor-default"
              >
                {/* Image */}
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl">📦</div>
                        <p className="mt-1 text-xs text-gray-400">
                          暂无图片
                        </p >
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5">
                  {product.seller_name && (
                    <p className="truncate text-[11px] font-medium text-gray-400">
                      {product.seller_name}
                    </p >
                  )}

                  <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-900">
                    {product.name}
                  </h2>

                  {product.price_krw !== null && (
                    <div className="mt-2">
                      <p className="text-base font-bold tracking-tight text-gray-950">
                        ₩{product.price_krw.toLocaleString()}
                      </p >

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        韩国售价
                      </p >
                    </div>
                  )}

                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400">
                      {product.description}
                    </p >
                  )}

                  {product.product_url ? (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-xs font-semibold text-gray-700">
                        查看商品详情 →
                      </p >
                    </div>
                  ) : (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-300">
                        暂不可申请
                      </p >
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs leading-5 text-gray-400">
            🧪 测试版暂不支持实际付款和购买
          </p >
        </div>
      </div>
    </main>
  );
}