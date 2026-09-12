"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type QuoteRequest = {
  id: number;
  image_url: string | null;
  product_url: string | null;
  request_note: string | null;
  request_type: string | null;
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

const statusSteps = [
  {
    value: "pending",
    label: "已提交",
  },
  {
    value: "finding",
    label: "寻找商品中",
  },
  {
    value: "quoted",
    label: "报价完成",
  },
  {
    value: "confirmed",
    label: "已确认",
  },
  {
    value: "completed",
    label: "测试完成",
  },
];

export default function RequestPage() {
  const params = useParams();

  const token =
    params.token as string;

  const [
    request,
    setRequest,
  ] =
    useState<QuoteRequest | null>(
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
    messages,
    setMessages,
  ] =
    useState<Message[]>([]);

  const [
    newMessage,
    setNewMessage,
  ] =
    useState("");

  const [
    sendingMessage,
    setSendingMessage,
  ] =
    useState(false);

  useEffect(() => {
    async function loadRequest() {
      try {
        const response =
          await fetch(
            `/api/request/${token}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            "找不到申请信息。"
          );

          return;
        }

        setRequest(
          data.request
        );
      } catch (error) {
        console.error(error);

        setError(
          "找不到申请信息。"
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadRequest();
    }
  }, [token]);

  async function loadMessages() {
    try {
      const response =
        await fetch(
          `/api/request/${token}/messages`
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(data);

        return;
      }

      setMessages(
        data.messages ?? []
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMessage() {
    const message =
      newMessage.trim();

    if (
      !message ||
      sendingMessage
    ) {
      return;
    }

    setSendingMessage(true);

    try {
      const response =
        await fetch(
          `/api/request/${token}/messages`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(data);

        alert(
          "发送失败，请重试。"
        );

        return;
      }

      setNewMessage("");

      await loadMessages();
    } catch (error) {
      console.error(error);

      alert(
        "发送失败，请重试。"
      );
    } finally {
      setSendingMessage(
        false
      );
    }
  }

  useEffect(() => {
    if (token) {
      loadMessages();
    }
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f7f9] px-5 py-10">
        <p className="text-center text-sm text-gray-500">
          正在加载...
        </p>
      </main>
    );
  }

  if (
    error ||
    !request
  ) {
    return (
      <main className="min-h-screen bg-[#f6f7f9] px-5 py-10">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-7 text-center">
          <div className="text-3xl">
            😥
          </div>

          <h1 className="mt-4 text-lg font-bold text-gray-950">
            找不到申请信息
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            请确认链接是否正确。
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
          >
            返回首页
          </a>
        </div>
      </main>
    );
  }

  const currentStatusIndex =
    statusSteps.findIndex(
      (step) =>
        step.value ===
        request.status
    );

  const quoteReady =
    ![
      "pending",
      "finding",
    ].includes(
      request.status
    );

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto max-w-md px-5 pb-12 pt-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-medium text-gray-500"
          >
            ← 首页
          </a>

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            BETA 测试版
          </span>
        </div>

        <div className="mt-7">
          <p className="text-sm font-medium text-gray-500">
            申请 #
            {request.id}
          </p>

          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-gray-950">
            我的购买申请
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            可以在这里查看商品信息、处理进度和报价。
          </p>
        </div>

        {/* Status */}
        <section className="mt-7 rounded-3xl bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-950">
              申请进度
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {statusSteps[
                currentStatusIndex
              ]?.label ??
                "处理中"}
            </span>
          </div>

          <div className="mt-6">
            {statusSteps.map(
              (
                step,
                index
              ) => {
                const completed =
                  index <=
                  currentStatusIndex;

                const current =
                  index ===
                  currentStatusIndex;

                return (
                  <div
                    key={
                      step.value
                    }
                    className="relative flex min-h-14 gap-4"
                  >
                    {index <
                      statusSteps.length -
                        1 && (
                      <div
                        className={`absolute left-[13px] top-7 h-full w-[2px] ${
                          index <
                          currentStatusIndex
                            ? "bg-gray-900"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        completed
                          ? "bg-gray-950 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : index +
                          1}
                    </div>

                    <div className="pb-5">
                      <p
                        className={`text-sm ${
                          current
                            ? "font-bold text-gray-950"
                            : completed
                              ? "font-medium text-gray-700"
                              : "text-gray-400"
                        }`}
                      >
                        {
                          step.label
                        }
                      </p>

                      {current && (
                        <p className="mt-1 text-xs text-gray-400">
                          当前进度
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* Product */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
          <h2 className="font-bold text-gray-950">
            商品信息
          </h2>

          {request.image_url && (
            <div className="mt-4 overflow-hidden rounded-2xl bg-gray-50 p-3">
              <img
                src={
                  request.image_url
                }
                alt="商品图片"
                className="max-h-72 w-full rounded-xl object-contain"
              />
            </div>
          )}

          <div className="mt-5 space-y-5">

            <div>
              <p className="text-xs text-gray-400">
                申请方式
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {request.request_type ===
                "find"
                  ? "📷 图片找商品"
                  : "🔗 商品链接"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                数量
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {request.quantity ??
                  1}{" "}
                件
              </p>
            </div>

            {request.product_url && (
              <div>
                <p className="text-xs text-gray-400">
                  商品链接
                </p>

                <a
                  href={
                    request.product_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm font-medium text-blue-600"
                >
                  查看原商品 →
                </a>
              </div>
            )}

            {request.request_note && (
              <div>
                <p className="text-xs text-gray-400">
                  补充说明
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                  {
                    request.request_note
                  }
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quote */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-950">
              报价详情
            </h2>

            {quoteReady && (
              <span className="text-xs font-semibold text-green-600">
                报价完成
              </span>
            )}
          </div>

          {!quoteReady ? (
            <div className="mt-5 rounded-2xl bg-gray-50 px-4 py-5">
              <p className="text-sm font-medium text-gray-700">
                ⏳ 正在准备报价
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                我们确认商品后，会在这里显示详细费用。
              </p>
            </div>
          ) : (
            <div className="mt-5">

              <div className="space-y-4 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    商品价格
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₩
                    {(
                      request.product_price ??
                      0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    韩国国内运费
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₩
                    {(
                      request.domestic_shipping ??
                      0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    代购服务费
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₩
                    {(
                      request.service_fee ??
                      0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    预计国际运费
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₩
                    {(
                      request.international_shipping ??
                      0
                    ).toLocaleString()}
                  </span>
                </div>

              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p className="text-sm font-bold text-gray-950">
                      预计总金额
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      最终金额可能会有所调整
                    </p>
                  </div>

                  <span className="text-2xl font-bold tracking-tight text-gray-950">
                    ₩
                    {(
                      request.total_price ??
                      0
                    ).toLocaleString()}
                  </span>

                </div>
              </div>
            </div>
          )}

          {quoteReady && (
            <button
              type="button"
              onClick={() => {
                alert(
                  "测试版暂不支持实际付款和购买。"
                );
              }}
              className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-bold text-white"
            >
              购买商品
            </button>
          )}

          <p className="mt-5 text-xs leading-5 text-gray-400">
            测试版报价仅供参考，不会产生实际付款。
          </p>
        </section>

        {/* Chat */}
        <section className="mt-4 rounded-3xl bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">

          <h2 className="font-bold text-gray-950">
            💬 1对1咨询
          </h2>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            对商品、选项或报价有疑问？可以直接给我们留言。
          </p>

          <div className="mt-5 min-h-24 space-y-3">

            {messages.length ===
            0 ? (
              <div className="rounded-2xl bg-gray-50 px-4 py-5 text-center">
                <p className="text-sm text-gray-400">
                  暂无消息
                </p>
              </div>
            ) : (
              messages.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className={`flex ${
                      item.sender ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div>

                      <p
                        className={`mb-1 text-[11px] text-gray-400 ${
                          item.sender ===
                          "user"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {item.sender ===
                        "user"
                          ? "我"
                          : "客服"}
                      </p>

                      <div
                        className={`max-w-[260px] rounded-2xl px-4 py-3 text-sm leading-5 ${
                          item.sender ===
                          "user"
                            ? "bg-gray-950 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {
                          item.message
                        }
                      </div>

                    </div>
                  </div>
                )
              )
            )}
          </div>

          <div className="mt-5 flex gap-2">

            <input
              type="text"
              value={
                newMessage
              }
              onChange={(e) =>
                setNewMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  sendMessage();
                }
              }}
              placeholder="请输入消息..."
              className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
            />

            <button
              type="button"
              onClick={
                sendMessage
              }
              disabled={
                sendingMessage ||
                !newMessage.trim()
              }
              className="shrink-0 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
            >
              {sendingMessage
                ? "发送中"
                : "发送"}
            </button>

          </div>
        </section>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs leading-5 text-gray-400">
            🧪 测试版暂不支持实际付款和购买
          </p>
        </div>

      </div>
    </main>
  );
}