"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type QuoteRequest = {
  id: number;
  image_url: string | null;
  product_url: string | null;
  request_note: string | null;
  quantity: number;
  status: string;
  created_at: string;

  product_price: number | null;
  domestic_shipping: number | null;
  international_shipping: number | null;
  service_fee: number | null;
  total_price: number | null;
};

type Message = {
  id: number;
  sender: "user" | "admin";
  message: string;
  created_at: string;
};

function getExternalUrl(url: string) {
  const trimmed = url.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [messagesByRequest, setMessagesByRequest] = useState<
    Record<number, Message[]>
  >({});

  const [messageInputs, setMessageInputs] = useState<
    Record<number, string>
  >({});

  const [sendingMessageId, setSendingMessageId] = useState<number | null>(
    null
  );

  const [openChatId, setOpenChatId] = useState<number | null>(null);

  async function loadRequests() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setRequests([]);
        return;
      }

      setRequests(data.requests ?? []);
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function updateField(
    id: number,
    field:
      | "product_price"
      | "domestic_shipping"
      | "international_shipping"
      | "service_fee",
    value: string
  ) {
    const numberValue = value === "" ? null : Number(value);

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              [field]: numberValue,
            }
          : request
      )
    );
  }

  async function completeQuote(request: QuoteRequest) {
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: request.id,
          product_price: request.product_price ?? 0,
          domestic_shipping: request.domestic_shipping ?? 0,
          international_shipping: request.international_shipping ?? 0,
          service_fee: request.service_fee ?? 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("견적 저장에 실패했습니다.");
        return;
      }

      alert("견적이 저장되었습니다.");
      await loadRequests();
    } catch (error) {
      console.error(error);
      alert("견적 저장에 실패했습니다.");
    }
  }

  async function saveStatus(request: QuoteRequest) {
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: request.id,
          product_price: request.product_price ?? 0,
          domestic_shipping: request.domestic_shipping ?? 0,
          international_shipping: request.international_shipping ?? 0,
          service_fee: request.service_fee ?? 0,
          status: request.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("상태 저장에 실패했습니다.");
        return;
      }

      alert("상태가 저장되었습니다.");
      await loadRequests();
    } catch (error) {
      console.error(error);
      alert("상태 저장에 실패했습니다.");
    }
  }

  async function loadMessages(requestId: number) {
    try {
      const response = await fetch(
        `/api/admin/quotes/${requestId}/messages`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setMessagesByRequest((current) => ({
        ...current,
        [requestId]: data.messages ?? [],
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async function sendAdminMessage(requestId: number) {
    const message = messageInputs[requestId]?.trim();

    if (!message || sendingMessageId === requestId) {
      return;
    }

    setSendingMessageId(requestId);

    try {
      const response = await fetch(
        `/api/admin/quotes/${requestId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("메시지 전송에 실패했습니다.");
        return;
      }

      setMessageInputs((current) => ({
        ...current,
        [requestId]: "",
      }));

      await loadMessages(requestId);
    } catch (error) {
      console.error(error);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setSendingMessageId(null);
    }
  }

  function toggleChat(requestId: number) {
    if (openChatId === requestId) {
      setOpenChatId(null);
      return;
    }

    setOpenChatId(requestId);
    loadMessages(requestId);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <p>불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* 관리자 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            K-Bridge 관리자
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            요청, 채팅, 상품을 관리할 수 있습니다.
          </p>
        </div>

        {/* 관리자 메뉴 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/admin"
            className="rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
          >
            📦 요청 관리
          </Link>

          <Link
            href="/admin/products"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-900"
          >
            🛍 상품 관리
          </Link>
        </div>

        {/* 요청 제목 */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            견적 요청
          </h2>

          <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            {requests.length}건
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              아직 접수된 견적 요청이 없습니다.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {requests.map((request) => {
              const total =
                (request.product_price ?? 0) +
                (request.domestic_shipping ?? 0) +
                (request.international_shipping ?? 0) +
                (request.service_fee ?? 0);

              const messages = messagesByRequest[request.id] ?? [];

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6"
                >
                  {/* 요청 기본정보 */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        요청 #{request.id}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleString(
                          "ko-KR"
                        )}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      {request.status}
                    </span>
                  </div>

                  {/* 상품 이미지 */}
                  {request.image_url && (
                    <img
                      src={request.image_url}
                      alt="상품 이미지"
                      className="mt-5 max-h-72 w-full rounded-xl object-contain"
                    />
                  )}

                  {/* 요청 정보 */}
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">수량:</span>{" "}
                      {request.quantity ?? 1}개
                    </p>

                    <p className="mt-2 text-sm text-gray-900">
                      <span className="font-semibold">요청사항:</span>{" "}
                      {request.request_note || "없음"}
                    </p>

                    <div className="mt-2 text-sm text-gray-900">
                      <span className="font-semibold">상품 링크:</span>{" "}

                      {request.product_url ? (
                        <button
                          type="button"
                          onClick={() => {
                            const url = request.product_url;

                            if (!url) {
                              return;
                            }

                            window.open(
                              getExternalUrl(url),
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          className="font-semibold text-blue-600"
                        >
                          링크 열기
                        </button>
                      ) : (
                        "없음"
                      )}
                    </div>
                  </div>

                  {/* 상태 관리 */}
                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-gray-700">
                      진행 상태
                    </label>

                    <select
                      value={request.status}
                      onChange={(e) => {
                        setRequests((current) =>
                          current.map((item) =>
                            item.id === request.id
                              ? {
                                  ...item,
                                  status: e.target.value,
                                }
                              : item
                          )
                        );
                      }}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                    >
                      <option value="pending">요청 접수</option>
                      <option value="finding">상품 찾는 중</option>
                      <option value="quoted">견적 완료</option>
                      <option value="confirmed">고객 확인</option>
                      <option value="completed">테스트 완료</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => saveStatus(request)}
                      className="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 font-semibold text-white"
                    >
                      상태 저장
                    </button>
                  </div>

                  {/* 채팅 열기 버튼 */}
                  <button
                    type="button"
                    onClick={() => toggleChat(request.id)}
                    className="mt-5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900"
                  >
                    {openChatId === request.id
                      ? "💬 채팅 닫기"
                      : "💬 1:1 채팅 열기"}
                  </button>

                  {/* 채팅 */}
                  {openChatId === request.id && (
                    <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            💬 요청 #{request.id} 채팅
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            이 요청에 연결된 대화입니다.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => loadMessages(request.id)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold"
                        >
                          새로고침
                        </button>
                      </div>

                      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-white p-3">
                        {messages.length === 0 ? (
                          <p className="py-6 text-center text-sm text-gray-400">
                            아직 메시지가 없습니다.
                          </p>
                        ) : (
                          messages.map((item) => (
                            <div
                              key={item.id}
                              className={`flex ${
                                item.sender === "admin"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                                  item.sender === "admin"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p>{item.message}</p>

                                <p
                                  className={`mt-1 text-[10px] ${
                                    item.sender === "admin"
                                      ? "text-gray-300"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {item.sender === "admin"
                                    ? "관리자"
                                    : "요청자"}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={messageInputs[request.id] ?? ""}
                          onChange={(e) =>
                            setMessageInputs((current) => ({
                              ...current,
                              [request.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              sendAdminMessage(request.id);
                            }
                          }}
                          placeholder="답장을 입력하세요"
                          className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            sendAdminMessage(request.id)
                          }
                          disabled={
                            sendingMessageId === request.id ||
                            !(messageInputs[request.id] ?? "").trim()
                          }
                          className="rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-40"
                        >
                          {sendingMessageId === request.id
                            ? "전송 중..."
                            : "전송"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 견적 입력 */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      견적 입력
                    </h3>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="text-sm font-medium text-gray-700">
                        상품 가격
                        <input
                          type="number"
                          value={request.product_price ?? ""}
                          onChange={(e) =>
                            updateField(
                              request.id,
                              "product_price",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                          placeholder="35000"
                        />
                      </label>

                      <label className="text-sm font-medium text-gray-700">
                        한국 배송비
                        <input
                          type="number"
                          value={request.domestic_shipping ?? ""}
                          onChange={(e) =>
                            updateField(
                              request.id,
                              "domestic_shipping",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                          placeholder="3000"
                        />
                      </label>

                      <label className="text-sm font-medium text-gray-700">
                        국제 배송비
                        <input
                          type="number"
                          value={request.international_shipping ?? ""}
                          onChange={(e) =>
                            updateField(
                              request.id,
                              "international_shipping",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                          placeholder="12000"
                        />
                      </label>

                      <label className="text-sm font-medium text-gray-700">
                        구매대행 수수료
                        <input
                          type="number"
                          value={request.service_fee ?? ""}
                          onChange={(e) =>
                            updateField(
                              request.id,
                              "service_fee",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                          placeholder="5000"
                        />
                      </label>
                    </div>

                    <div className="mt-5 rounded-xl bg-gray-100 p-4">
                      <p className="text-lg font-bold text-gray-900">
                        총 견적: {total.toLocaleString()}원
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => completeQuote(request)}
                      className="mt-4 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white"
                    >
                      견적 완료
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}