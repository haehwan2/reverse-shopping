"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  image_url: string | null;
  detail_images: string[] | null;
  product_url: string | null;
  seller_name: string | null;
  price_krw: number | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [priceKrw, setPriceKrw] = useState("");
  const [description, setDescription] = useState("");

  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);

  const [existingDetailImages, setExistingDetailImages] =
    useState<string[]>([]);

  // 대표 이미지
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  // 상세 이미지
  const [detailImages, setDetailImages] =
    useState<File[]>([]);

  const [detailPreviews, setDetailPreviews] =
    useState<string[]>([]);

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/products",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert(
          "추천 상품을 불러오지 못했습니다."
        );
        return;
      }

      setProducts(data.products ?? []);
    } catch (error) {
      console.error(error);

      alert(
        "추천 상품을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEdit(product: Product) {
    setEditingProductId(product.id);

    setName(product.name ?? "");
    setProductUrl(product.product_url ?? "");
    setSellerName(product.seller_name ?? "");

    setPriceKrw(
      product.price_krw !== null
        ? String(product.price_krw)
        : ""
    );

    setDescription(product.description ?? "");

    setImageUrl(product.image_url ?? "");
    setImagePreview(product.image_url ?? "");

    setSelectedImage(null);

    setExistingDetailImages(
      product.detail_images ?? []
    );

    setDetailImages([]);
    setDetailPreviews([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "이미지 파일을 선택해주세요."
      );
      return;
    }

    setSelectedImage(file);

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview(
      URL.createObjectURL(file)
    );
  }

  function cancelEdit() {
    setEditingProductId(null);

    setName("");
    setImageUrl("");
    setProductUrl("");
    setSellerName("");
    setPriceKrw("");
    setDescription("");

    setSelectedImage(null);
    setImagePreview("");

    setExistingDetailImages([]);

    setDetailImages([]);
    setDetailPreviews([]);
  }

  function removeSelectedImage() {
    setSelectedImage(null);

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");
    setImageUrl("");
  }

  function handleDetailImagesChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    const imageFiles =
      files.filter((file) =>
        file.type.startsWith("image/")
      );

    if (
      detailImages.length +
      imageFiles.length >
      8
    ) {
      alert(
        "상세 이미지는 최대 8장까지 등록할 수 있습니다."
      );
      return;
    }

    const newPreviews =
      imageFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setDetailImages((prev) => [
      ...prev,
      ...imageFiles,
    ]);

    setDetailPreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    e.target.value = "";
  }

  function removeDetailImage(
    index: number
  ) {
    setDetailPreviews((prev) => {
      const target =
        prev[index];

      if (
        target &&
        target.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          target
        );
      }

      return prev.filter(
        (_, i) =>
          i !== index
      );
    });

    setDetailImages((prev) =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    );
  }

  function clearDetailImages() {
    detailPreviews.forEach(
      (url) => {
        if (
          url.startsWith("blob:")
        ) {
          URL.revokeObjectURL(
            url
          );
        }
      }
    );

    setDetailImages([]);
    setDetailPreviews([]);
  }

  function getExternalUrl(
    url: string
  ) {
    const trimmed =
      url.trim();

    if (
      trimmed.startsWith(
        "http://"
      ) ||
      trimmed.startsWith(
        "https://"
      )
    ) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  async function addProduct() {
    if (!name.trim()) {
      alert(
        "상품명을 입력해주세요."
      );
      return;
    }

    if (!selectedImage) {
      alert(
        "대표 이미지를 선택해주세요."
      );
      return;
    }

    try {
      // 1. 대표 이미지 + 상세 이미지 업로드
      const formData =
        new FormData();

      formData.append(
        "files",
        selectedImage
      );

      detailImages.forEach(
        (file) => {
          formData.append(
            "files",
            file
          );
        }
      );

      const uploadResponse =
        await fetch(
          "/api/admin/product-images",
          {
            method: "POST",
            credentials:
              "include",
            body: formData,
          }
        );

      const uploadData =
        await uploadResponse.json();

      if (
        !uploadResponse.ok
      ) {
        console.error(
          uploadData
        );

        alert(
          uploadData.error ||
          "이미지 업로드에 실패했습니다."
        );

        return;
      }

      const uploadedUrls:
        string[] =
        uploadData.urls ?? [];

      if (
        uploadedUrls.length ===
        0
      ) {
        alert(
          "업로드된 이미지 URL을 받지 못했습니다."
        );
        return;
      }

      // 첫 번째 이미지 = 대표 이미지
      const coverImageUrl =
        uploadedUrls[0];

      // 두 번째부터 = 상세 이미지
      const detailImageUrls =
        uploadedUrls.slice(1);

      // 2. 상품 DB 저장
      const response =
        await fetch(
          "/api/admin/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              name:
                name.trim(),

              image_url:
                coverImageUrl,

              detail_images:
                detailImageUrls,

              product_url:
                productUrl.trim() ||
                null,

              seller_name:
                sellerName.trim() ||
                null,

              price_krw:
                priceKrw
                  ? Number(
                    priceKrw
                  )
                  : null,

              description:
                description.trim() ||
                null,

              sort_order:
                products.length +
                1,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(data);

        alert(
          "상품 등록에 실패했습니다."
        );

        return;
      }

      // 3. 입력값 초기화
      setName("");
      setImageUrl("");
      setProductUrl("");
      setSellerName("");
      setPriceKrw("");
      setDescription("");

      removeSelectedImage();
      clearDetailImages();

      await loadProducts();

      alert(
        "상품이 등록되었습니다."
      );
    } catch (error) {
      console.error(error);

      alert(
        "상품 등록에 실패했습니다."
      );
    }
  }

  async function updateProduct() {
    if (!editingProductId) {
      return;
    }

    if (!name.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    try {
      let finalImageUrl =
        imagePreview && !imagePreview.startsWith("blob:")
          ? imagePreview
          : imageUrl || null;

      let uploadedDetailUrls: string[] = [];

      const filesToUpload: File[] = [];

      if (selectedImage) {
        filesToUpload.push(selectedImage);
      }

      detailImages.forEach((file) => {
        filesToUpload.push(file);
      });

      if (filesToUpload.length > 0) {
        const formData = new FormData();

        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await fetch(
          "/api/admin/product-images",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.error(uploadData);

          alert(
            uploadData.error ||
            "이미지 업로드에 실패했습니다."
          );

          return;
        }

        const uploadedUrls: string[] =
          uploadData.urls ?? [];

        let currentIndex = 0;

        if (selectedImage) {
          finalImageUrl =
            uploadedUrls[currentIndex] ?? null;

          currentIndex += 1;
        }

        uploadedDetailUrls =
          uploadedUrls.slice(currentIndex);
      }

      const finalDetailImages = [
        ...existingDetailImages,
        ...uploadedDetailUrls,
      ];

      const response = await fetch(
        "/api/admin/products",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            id: editingProductId,

            name: name.trim(),

            image_url:
              finalImageUrl || null,

            detail_images:
              finalDetailImages,

            product_url:
              productUrl.trim() || null,

            seller_name:
              sellerName.trim() || null,

            price_krw:
              priceKrw === ""
                ? null
                : Number(priceKrw),

            description:
              description.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        alert(
          data.error ||
          "상품 수정에 실패했습니다."
        );

        return;
      }

      alert("상품이 수정되었습니다.");

      setEditingProductId(null);

      setName("");
      setImageUrl("");
      setProductUrl("");
      setSellerName("");
      setPriceKrw("");
      setDescription("");

      setSelectedImage(null);
      setImagePreview("");

      setExistingDetailImages([]);

      setDetailImages([]);
      setDetailPreviews([]);

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert("상품 수정에 실패했습니다.");
    }
  }

  async function toggleActive(
    product: Product
  ) {
    try {
      const response =
        await fetch(
          "/api/admin/products",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              id: product.id,
              is_active:
                !product.is_active,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(data);

        alert(
          "상태 변경에 실패했습니다."
        );
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        "상태 변경에 실패했습니다."
      );
    }
  }

  async function deleteProduct(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "이 상품을 삭제하시겠습니까?"
      );

    if (!confirmed) return;

    try {
      const response =
        await fetch(
          "/api/admin/products",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body:
              JSON.stringify({
                id,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(data);

        alert(
          "상품 삭제에 실패했습니다."
        );
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        "상품 삭제에 실패했습니다."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:p-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            K-Bridge 관리자
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            요청, 채팅, 상품을 관리할 수 있습니다.
          </p >
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/admin"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-900"
          >
            📦 요청 관리
          </Link>

          <Link
            href="/admin/products"
            className="rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
          >
            🛍 상품 관리
          </Link>
        </div>

        <h1 className="mt-10 text-2xl font-bold text-gray-900">
          추천 상품 관리
        </h1>

        <p className="mt-2 text-gray-500">
          추천 상품을 추가하거나 수정, 숨김, 삭제할 수 있습니다.
        </p >

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            상품 추가
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                상품명
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="예: 정샘물 에센셜 스킨 누더 쿠션"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>

            {/* 대표 이미지 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                대표 이미지
              </label>

              {!imagePreview ? (
                <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8">
                  <div className="text-center">
                    <div className="text-3xl">
                      📷
                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      대표 이미지
                      선택
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <img
                    src={
                      imagePreview
                    }
                    alt="대표 이미지"
                    className="max-h-72 w-full rounded-lg object-contain"
                  />

                  <button
                    type="button"
                    onClick={
                      removeSelectedImage
                    }
                    className="mt-3 text-sm font-medium text-red-500"
                  >
                    대표 이미지
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 상세 이미지 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                상세 이미지
              </label>

              <p className="mb-3 text-xs text-gray-400">
                상품 설명용
                이미지를 최대
                8장까지 등록할 수
                있습니다.
              </p>

              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6">
                <div className="text-center">
                  <div className="text-2xl">
                    🖼️
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    상세 이미지 추가
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    여러 장을 한 번에
                    선택할 수
                    있습니다.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleDetailImagesChange
                  }
                  className="hidden"
                />
              </label>

              {detailPreviews.length >
                0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {detailPreviews.map(
                      (
                        preview,
                        index
                      ) => (
                        <div
                          key={
                            preview
                          }
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                        >
                          <img
                            src={
                              preview
                            }
                            alt={`상세 이미지 ${index +
                              1
                              }`}
                            className="aspect-square w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeDetailImage(
                                index
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                          >
                            삭제
                          </button>

                          <div className="px-2 py-2 text-xs text-gray-500">
                            상세 이미지{" "}
                            {index +
                              1}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>

            {/* 상품 링크 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                한국 상품 링크
              </label>

              <input
                value={
                  productUrl
                }
                onChange={(e) =>
                  setProductUrl(
                    e.target.value
                  )
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>

            {/* 판매처 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                판매처 / 쇼핑몰
              </label>

              <input
                value={
                  sellerName
                }
                onChange={(e) =>
                  setSellerName(
                    e.target.value
                  )
                }
                placeholder="예: 올리브영"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>

            {/* 가격 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                한국 판매 가격
                (KRW)
              </label>

              <input
                type="number"
                value={
                  priceKrw
                }
                onChange={(e) =>
                  setPriceKrw(
                    e.target.value
                  )
                }
                placeholder="예: 35000"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                상품 설명
              </label>

              <textarea
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="상품에 대한 간단한 설명을 입력하세요."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>

            <button
              type="button"
              onClick={
                editingProductId
                  ? updateProduct
                  : addProduct
              }
              className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white"
            >
              {editingProductId
                ? "수정 저장"
                : "상품 추가"}
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700"
              >
                수정 취소
              </button>
            )}

          </div>
        </div>

        {/* 현재 추천 상품 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            현재 추천 상품
          </h2>

          {loading && (
            <p className="mt-4 text-gray-500">
              불러오는 중...
            </p>
          )}

          {!loading &&
            products.length ===
            0 && (
              <p className="mt-4 text-gray-500">
                등록된 상품이
                없습니다.
              </p>
            )}

          <div className="mt-4 space-y-4">
            {products.map(
              (product) => (
                <div
                  key={
                    product.id
                  }
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    {product.image_url ? (
                      <img
                        src={
                          product.image_url
                        }
                        alt={
                          product.name
                        }
                        className="h-24 w-24 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                        이미지 없음
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">
                        {
                          product.name
                        }
                      </p>

                      {product.seller_name && (
                        <p className="mt-1 text-sm text-gray-500">
                          {
                            product.seller_name
                          }
                        </p>
                      )}

                      {product.price_krw !==
                        null && (
                          <p className="mt-1 font-semibold text-gray-900">
                            ₩
                            {product.price_krw.toLocaleString()}
                          </p>
                        )}

                      <p className="mt-1 text-xs text-gray-400">
                        {product.is_active
                          ? "노출 중"
                          : "숨김"}
                      </p>

                      {product.product_url && (
                        <a
                          href={getExternalUrl(
                            product.product_url
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-sm font-medium text-blue-600"
                        >
                          한국 상품 링크
                          열기 →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleActive(
                          product
                        )
                      }
                      className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                    >
                      {product.is_active
                        ? "숨기기"
                        : "다시 표시"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProduct(
                          product.id
                        )
                      }
                      className="flex-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}