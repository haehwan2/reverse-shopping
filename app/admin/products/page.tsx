"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  is_active: boolean;
  sort_order: number;
  options: ProductOption[] | null;
};

type OptionGroupInput = {
  name: string;
  valuesText: string;
};

function createEmptyOptionGroup(): OptionGroupInput {
  return {
    name: "",
    valuesText: "",
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [priceKrw, setPriceKrw] = useState("");
  const [priceAdjustmentCny, setPriceAdjustmentCny] =
    useState("0");
  const [listPriceCny, setListPriceCny] =
    useState("");
  const [exchangeRate, setExchangeRate] =
    useState<number | null>(null);

  const [description, setDescription] =
    useState("");

  const [optionGroups, setOptionGroups] = useState<
    OptionGroupInput[]
  >([createEmptyOptionGroup()]);

  const [
    editingProductId,
    setEditingProductId,
  ] = useState<number | null>(null);

  const [
    existingDetailImages,
    setExistingDetailImages,
  ] = useState<string[]>([]);

  // 대표 이미지
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  // 새로 추가하는 상세 이미지
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

        setExchangeRate(
          Number(data.rate)
        );
      } catch (error) {
        console.error(
          "Exchange rate load error:",
          error
        );

        setExchangeRate(null);
      }
    }

    loadExchangeRate();
  }, []);

  const parsedPriceKrw =
    priceKrw === ""
      ? null
      : Number(priceKrw);

  const parsedAdjustment =
    priceAdjustmentCny === ""
      ? 0
      : Number(priceAdjustmentCny);

  const convertedPriceCny =
    exchangeRate !== null &&
      parsedPriceKrw !== null &&
      Number.isFinite(parsedPriceKrw)
      ? Math.round(
        parsedPriceKrw *
        exchangeRate
      )
      : null;

  const salePriceCny =
    convertedPriceCny !== null &&
      Number.isFinite(parsedAdjustment)
      ? Math.max(
        0,
        convertedPriceCny +
        parsedAdjustment
      )
      : null;

  const parsedListPrice =
    listPriceCny === ""
      ? null
      : Number(listPriceCny);

  const discountPercent =
    salePriceCny !== null &&
      parsedListPrice !== null &&
      Number.isFinite(parsedListPrice) &&
      parsedListPrice >
      salePriceCny &&
      parsedListPrice > 0
      ? Math.round(
        ((parsedListPrice -
          salePriceCny) /
          parsedListPrice) *
        100
      )
      : null;

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // 옵션
  // =========================

  function addOptionGroup() {
    setOptionGroups((prev) => [
      ...prev,
      createEmptyOptionGroup(),
    ]);
  }

  function updateOptionGroup(
    index: number,
    field: "name" | "valuesText",
    value: string
  ) {
    setOptionGroups((prev) =>
      prev.map((group, i) =>
        i === index
          ? {
            ...group,
            [field]: value,
          }
          : group
      )
    );
  }

  function removeOptionGroup(index: number) {
    setOptionGroups((prev) => {
      const next = prev.filter(
        (_, i) => i !== index
      );

      if (next.length === 0) {
        return [
          createEmptyOptionGroup(),
        ];
      }

      return next;
    });
  }

  function buildOptions(): ProductOption[] {
    return optionGroups
      .map((group) => {
        const values = Array.from(
          new Set(
            group.valuesText
              .split(",")
              .map((value) =>
                value.trim()
              )
              .filter(Boolean)
          )
        );

        return {
          name: group.name.trim(),
          values,
        };
      })
      .filter(
        (group) =>
          group.name.length > 0 &&
          group.values.length > 0
      );
  }

  function validateOptions() {
    const usedNames =
      new Set<string>();

    for (const group of optionGroups) {
      const optionName =
        group.name.trim();

      const optionValues =
        group.valuesText
          .split(",")
          .map((value) =>
            value.trim()
          )
          .filter(Boolean);

      const hasName =
        optionName.length > 0;

      const hasValues =
        optionValues.length > 0;

      // 아무것도 입력하지 않은 기본 옵션 칸은 허용
      if (!hasName && !hasValues) {
        continue;
      }

      // 옵션 종류만 입력
      if (hasName && !hasValues) {
        alert(
          `"${optionName}" 옵션의 선택지를 입력해주세요.\n\n예:\n옵션 종류: 颜色\n선택지: 红色, 蓝色, 黄色`
        );

        return false;
      }

      // 선택지만 입력
      if (!hasName && hasValues) {
        alert(
          "선택지를 입력했다면 옵션 종류도 입력해주세요.\n\n예:\n옵션 종류: 颜色\n선택지: 红色, 蓝色, 黄色"
        );

        return false;
      }

      const normalizedName =
        optionName.toLowerCase();

      // 같은 옵션 종류를 여러 개 만든 경우
      if (
        usedNames.has(
          normalizedName
        )
      ) {
        alert(
          `"${optionName}" 옵션 종류가 중복되어 있습니다.\n\n같은 종류의 선택지는 하나의 칸에 쉼표(,)로 구분해서 입력해주세요.`
        );

        return false;
      }

      usedNames.add(
        normalizedName
      );
    }

    return true;
  }

  function resetOptionGroups() {
    setOptionGroups([
      createEmptyOptionGroup(),
    ]);
  }

  // =========================
  // 수정 시작
  // =========================

  function startEdit(product: Product) {
    setEditingProductId(
      product.id
    );

    setName(
      product.name ?? ""
    );

    setProductUrl(
      product.product_url ?? ""
    );

    setSellerName(
      product.seller_name ?? ""
    );

    setPriceKrw(
      product.price_krw !== null
        ? String(product.price_krw)
        : ""
    );

    setPriceAdjustmentCny(
      product.price_adjustment_cny !== null &&
        product.price_adjustment_cny !== undefined
        ? String(
          product.price_adjustment_cny
        )
        : "0"
    );

    setListPriceCny(
      product.list_price_cny !== null &&
        product.list_price_cny !== undefined
        ? String(
          product.list_price_cny
        )
        : ""
    );

    setDescription(
      product.description ?? ""
    );

    setOptionGroups(
      product.options &&
        product.options.length > 0
        ? product.options.map(
          (group) => ({
            name: group.name,

            valuesText:
              group.values.join(
                ", "
              ),
          })
        )
        : [
          createEmptyOptionGroup(),
        ]
    );

    setImageUrl(
      product.image_url ?? ""
    );

    setImagePreview(
      product.image_url ?? ""
    );

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

  function cancelEdit() {
    setEditingProductId(null);

    setName("");
    setImageUrl("");
    setProductUrl("");
    setSellerName("");
    setPriceKrw("");
    setPriceAdjustmentCny("0");
    setListPriceCny("");
    setDescription("");

    resetOptionGroups();

    setSelectedImage(null);

    if (
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");

    setExistingDetailImages(
      []
    );

    clearDetailImages();
  }

  // =========================
  // 대표 이미지
  // =========================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "이미지 파일을 선택해주세요."
      );

      return;
    }

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );

    e.target.value = "";
  }

  function removeSelectedImage() {
    setSelectedImage(null);

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");
    setImageUrl("");
  }

  // =========================
  // 상세 이미지
  // =========================

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
        file.type.startsWith(
          "image/"
        )
      );

    const totalCount =
      existingDetailImages.length +
      detailImages.length +
      imageFiles.length;

    if (totalCount > 8) {
      alert(
        "상세 이미지는 최대 8장까지 등록할 수 있습니다."
      );

      e.target.value = "";

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
    setDetailPreviews(
      (prev) => {
        const target =
          prev[index];

        if (
          target &&
          target.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            target
          );
        }

        return prev.filter(
          (_, i) =>
            i !== index
        );
      }
    );

    setDetailImages((prev) =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    );
  }

  function removeExistingDetailImage(
    index: number
  ) {
    setExistingDetailImages(
      (prev) =>
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
          url.startsWith(
            "blob:"
          )
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

  // =========================
  // URL 처리
  // =========================

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

  // =========================
  // 상품 추가
  // =========================

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

    if (!validateOptions()) {
      return;
    }

    try {
      // 대표 이미지 + 상세 이미지 업로드
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

      const coverImageUrl =
        uploadedUrls[0];

      const detailImageUrls =
        uploadedUrls.slice(1);

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
                priceKrw === ""
                  ? null
                  : Number(
                    priceKrw
                  ),

              price_adjustment_cny:
                priceAdjustmentCny === ""
                  ? 0
                  : Number(
                    priceAdjustmentCny
                  ),

              list_price_cny:
                listPriceCny === ""
                  ? null
                  : Number(
                    listPriceCny
                  ),

              description:
                description.trim() ||
                null,

              options:
                buildOptions(),

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
          data.error ||
          "상품 등록에 실패했습니다."
        );

        return;
      }

      setName("");
      setImageUrl("");
      setProductUrl("");
      setSellerName("");
      setPriceKrw("");
      setPriceAdjustmentCny("0");
      setListPriceCny("");
      setDescription("");

      resetOptionGroups();

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

  // =========================
  // 상품 수정
  // =========================

  async function updateProduct() {
    if (!editingProductId) {
      return;
    }

    if (!name.trim()) {
      alert(
        "상품명을 입력해주세요."
      );

      return;
    }

    if (!validateOptions()) {
      return;
    }

    try {
      let finalImageUrl =
        imagePreview &&
          !imagePreview.startsWith(
            "blob:"
          )
          ? imagePreview
          : imageUrl || null;

      let uploadedDetailUrls:
        string[] = [];

      const filesToUpload:
        File[] = [];

      if (selectedImage) {
        filesToUpload.push(
          selectedImage
        );
      }

      detailImages.forEach(
        (file) => {
          filesToUpload.push(
            file
          );
        }
      );

      if (
        filesToUpload.length >
        0
      ) {
        const formData =
          new FormData();

        filesToUpload.forEach(
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

        let currentIndex = 0;

        if (selectedImage) {
          finalImageUrl =
            uploadedUrls[
            currentIndex
            ] ?? null;

          currentIndex += 1;
        }

        uploadedDetailUrls =
          uploadedUrls.slice(
            currentIndex
          );
      }

      const finalDetailImages = [
        ...existingDetailImages,
        ...uploadedDetailUrls,
      ];

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
              id:
                editingProductId,

              name:
                name.trim(),

              image_url:
                finalImageUrl ||
                null,

              detail_images:
                finalDetailImages,

              product_url:
                productUrl.trim() ||
                null,

              seller_name:
                sellerName.trim() ||
                null,

              price_krw:
                priceKrw === ""
                  ? null
                  : Number(
                    priceKrw
                  ),

              price_adjustment_cny:
                priceAdjustmentCny === ""
                  ? 0
                  : Number(
                    priceAdjustmentCny
                  ),

              list_price_cny:
                listPriceCny === ""
                  ? null
                  : Number(
                    listPriceCny
                  ),

              description:
                description.trim() ||
                null,

              options:
                buildOptions(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(data);

        alert(
          data.error ||
          "상품 수정에 실패했습니다."
        );

        return;
      }

      alert(
        "상품이 수정되었습니다."
      );

      setEditingProductId(
        null
      );

      setName("");
      setImageUrl("");
      setProductUrl("");
      setSellerName("");
      setPriceKrw("");
      setPriceAdjustmentCny("0");
      setListPriceCny("");
      setDescription("");

      resetOptionGroups();

      setSelectedImage(null);
      setImagePreview("");

      setExistingDetailImages(
        []
      );

      clearDetailImages();

      await loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        "상품 수정에 실패했습니다."
      );
    }
  }

  // =========================
  // 상품 노출 / 숨김
  // =========================

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

  // =========================
  // 상품 삭제
  // =========================

  async function deleteProduct(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "이 상품을 삭제하시겠습니까?"
      );

    if (!confirmed) {
      return;
    }

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

        {/* 관리자 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            CK-Bridge 관리자
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            요청, 채팅, 상품을 관리할 수 있습니다.
          </p>
        </div>

        {/* 관리자 메뉴 */}
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
        </p>

        {/* 상품 추가 / 수정 */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            {editingProductId
              ? "상품 수정"
              : "상품 추가"}
          </h2>

          <div className="mt-5 space-y-5">

            {/* 상품명 */}
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
                      대표 이미지 선택
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
                    대표 이미지 삭제
                  </button>
                </div>
              )}
            </div>

            {/* 기존 상세 이미지 */}
            {existingDetailImages.length >
              0 && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    기존 상세 이미지
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {existingDetailImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          key={
                            `${image}-${index}`
                          }
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                        >
                          <img
                            src={image}
                            alt={`기존 상세 이미지 ${index + 1
                              }`}
                            className="aspect-square w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeExistingDetailImage(
                                index
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                          >
                            삭제
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* 새 상세 이미지 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                상세 이미지
              </label>

              <p className="mb-3 text-xs text-gray-400">
                상품 설명용 이미지를 최대 8장까지 등록할 수 있습니다.
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
                    여러 장을 한 번에 선택할 수 있습니다.
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
                            `${preview}-${index}`
                          }
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                        >
                          <img
                            src={
                              preview
                            }
                            alt={`상세 이미지 ${index + 1
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
                            {index + 1}
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
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-base font-bold text-gray-900">
                중국 판매 가격 설정
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                한국 가격을 현재 환율로 자동 환산한 뒤,
                가격 조정값을 더하거나 빼서 실제 판매가를 계산합니다.
              </p >

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  한국 판매 가격 (KRW)
                </label>

                <input
                  type="number"
                  min="0"
                  value={priceKrw}
                  onChange={(e) =>
                    setPriceKrw(
                      e.target.value
                    )
                  }
                  placeholder="예: 35000"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                />
              </div>

              <div className="mt-4 rounded-xl bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">
                    현재 환율
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {exchangeRate !== null
                      ? `₩1 = ¥${exchangeRate.toFixed(
                        6
                      )}`
                      : "불러오는 중..."}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">
                    환율 기준 가격
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {convertedPriceCny !== null
                      ? `¥${convertedPriceCny.toLocaleString()}`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  가격 조정 (CNY)
                </label>

                <input
                  type="number"
                  step="1"
                  value={priceAdjustmentCny}
                  onChange={(e) =>
                    setPriceAdjustmentCny(
                      e.target.value
                    )
                  }
                  placeholder="예: 5 또는 -3"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                />

                <p className="mt-2 text-xs text-gray-400">
                  +5를 입력하면 5위안을 더하고,
                  -3을 입력하면 3위안을 뺍니다.
                </p >
              </div>

              <div className="mt-4 rounded-xl bg-black p-4 text-white">
                <p className="text-xs text-gray-300">
                  예상 실제 판매가
                </p >

                <p className="mt-1 text-2xl font-bold">
                  {salePriceCny !== null
                    ? `¥${salePriceCny.toLocaleString()}`
                    : "-"}
                </p >

                <p className="mt-2 text-xs text-gray-400">
                  환율이 바뀌면 판매가도 자동으로 다시 계산됩니다.
                </p >
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  중국 정가 (CNY, 선택)
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={listPriceCny}
                  onChange={(e) =>
                    setListPriceCny(
                      e.target.value
                    )
                  }
                  placeholder="예: 199"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  실제 판매가보다 높은 정가를 입력하면
                  할인율이 자동 계산됩니다.
                </p >
              </div>

              {discountPercent !== null && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-600">
                    할인 미리보기
                  </p >

                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-950">
                      ¥
                      {salePriceCny?.toLocaleString()}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      ¥
                      {parsedListPrice?.toLocaleString()}
                    </span>

                    <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>
              )}

              {salePriceCny !== null &&
                parsedListPrice !== null &&
                parsedListPrice < salePriceCny && (
                  <p className="mt-3 text-xs font-medium text-orange-600">
                    정가가 실제 판매가보다 낮습니다.
                    이 경우 할인 표시는 하지 않습니다.
                  </p >
                )}

              {salePriceCny !== null &&
                parsedListPrice !== null &&
                parsedListPrice === salePriceCny && (
                  <p className="mt-3 text-xs text-gray-500">
                    정가와 판매가가 같아서 할인 표시는 숨겨집니다.
                  </p >
                )}
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

            {/* 옵션 */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-gray-700">
                  상품 옵션
                </label>

                <button
                  type="button"
                  onClick={
                    addOptionGroup
                  }
                  className="shrink-0 text-sm font-semibold text-blue-600"
                >
                  + 옵션 종류 추가
                </button>
              </div>

              <div className="mb-4 rounded-xl bg-blue-50 p-3">
                <p className="text-xs font-semibold text-blue-800">
                  입력 예시
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  옵션 종류: 颜色
                  <br />
                  선택지: 红色, 蓝色, 黄色, 紫色, 粉色
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-600">
                  빨강, 파랑 등을 각각 옵션 종류로 만들지 말고
                  하나의 옵션 종류 안에 쉼표로 입력하세요.
                </p>
              </div>

              <div className="space-y-3">
                {optionGroups.map(
                  (
                    group,
                    index
                  ) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                          옵션 종류
                        </label>

                        <input
                          value={
                            group.name
                          }
                          onChange={(e) =>
                            updateOptionGroup(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="예: 颜色 / 尺寸 / 口味 / 容量"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                          선택지
                        </label>

                        <textarea
                          value={
                            group.valuesText
                          }
                          onChange={(e) =>
                            updateOptionGroup(
                              index,
                              "valuesText",
                              e.target.value
                            )
                          }
                          placeholder="예: 红色, 蓝色, 黄色, 紫色, 粉色"
                          rows={2}
                          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                          여러 선택지는 쉼표(,)로 구분해주세요.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeOptionGroup(
                            index
                          )
                        }
                        className="mt-3 text-xs font-medium text-red-500"
                      >
                        이 옵션 종류 삭제
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 저장 */}
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
                onClick={
                  cancelEdit
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700"
              >
                수정 취소
              </button>
            )}
          </div>
        </div>

        {/* 현재 상품 */}
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
                등록된 상품이 없습니다.
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

                      {product.options &&
                        product.options
                          .length >
                        0 && (
                          <div className="mt-3 space-y-1">
                            {product.options.map(
                              (
                                group,
                                index
                              ) => (
                                <p
                                  key={`${group.name}-${index}`}
                                  className="text-xs text-gray-500"
                                >
                                  <span className="font-semibold text-gray-700">
                                    {
                                      group.name
                                    }
                                    :
                                  </span>{" "}
                                  {group.values.join(
                                    ", "
                                  )}
                                </p>
                              )
                            )}
                          </div>
                        )}

                      {product.product_url && (
                        <a
                          href={getExternalUrl(
                            product.product_url
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-sm font-medium text-blue-600"
                        >
                          한국 상품 링크 열기 →
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
                      onClick={() =>
                        startEdit(
                          product
                        )
                      }
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