"use client";

import { useEffect, useState } from "react";

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <p>불러오는 중...</p >
      </main>
    );
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

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">
          견적 요청 관리
        </h1>

        {requests.length === 0 ? (
          <p className="mt-8 text-gray-500">
            아직 접수된 견적 요청이 없습니다.
          </p >
        ) : (
          <div className="mt-8 space-y-6">
            {requests.map((request) => {
              const total =
                (request.product_price ?? 0) +
                (request.domestic_shipping ?? 0) +
                (request.international_shipping ?? 0) +
                (request.service_fee ?? 0);

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  {request.image_url && (
                    <img
                      src={request.image_url}
                      alt="상품 이미지"
                      className="mb-4 max-h-72 w-full rounded-xl object-contain"
                    />
                  )}

                  <p className="text-sm text-gray-500">
                    요청 번호: {request.id}
                  </p >

                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-700">
                      수량:
                    </span>

                    <span className="ml-2 text-sm text-gray-900">
                      {request.quantity ?? 1}개
                    </span>
                  </div>

                  <p className="mt-3 text-gray-900">
                    요청사항: {request.request_note || "없음"}
                  </p >

                  <p className="mt-2 text-gray-900">
                    상품 링크:{" "}
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
                        className="text-blue-600"
                      >
                        링크 열기
                      </button>
                    ) : (
                      "없음"
                    )}
                  </p >

                  <p className="mt-2 text-gray-900">
                    상태: {request.status}
                  </p >

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      진행 상태 변경
                    </label>

                    <select
                      value={request.status}
                      onChange={(e) => {
                        setRequests((current) =>
                          current.map((item) =>
                            item.id === request.id
                              ? { ...item, status: e.target.value }
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

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          💬 1:1 채팅
                        </h3>

                        <button
                          type="button"
                          onClick={() => loadMessages(request.id)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                        >
                          메시지 불러오기
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        {(messagesByRequest[request.id] ?? []).length === 0 ? (
                          <p className="py-3 text-center text-sm text-gray-400">
                            메시지를 불러오세요.
                          </p >
                        ) : (
                          (messagesByRequest[request.id] ?? []).map((item) => (
                            <div
                              key={item.id}
                              className={`flex ${item.sender === "admin"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${item.sender === "admin"
                                  ? "bg-black text-white"
                                  : "bg-white text-gray-900"
                                  }`}
                              >
                                {item.message}
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
                          onClick={() => sendAdminMessage(request.id)}
                          disabled={
                            sendingMessageId === request.id ||
                            !(messageInputs[request.id] ?? "").trim()
                          }
                          className="rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-40"
                        >
                          {sendingMessageId === request.id ? "전송 중..." : "전송"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    요청시간:{" "}
                    {new Date(request.created_at).toLocaleString("ko-KR")}
                  </p >

                  <div className="mt-6 grid gap-4">
                    <label>
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

                    <label>
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

                    <label>
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

                    <label>
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

                  <div className="mt-6 rounded-xl bg-gray-100 p-4">
                    <p className="text-lg font-bold">
                      총 견적: {total.toLocaleString()}원
                    </p >
                  </div>

                  <button
                    onClick={() => completeQuote(request)}
                    className="mt-4 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white"
                  >
                    견적 완료
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}