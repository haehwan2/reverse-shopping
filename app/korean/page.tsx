"use client";

import { useRouter } from "next/navigation";

export default function KoreanPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto min-h-screen max-w-md bg-white px-5 pb-10 pt-6 sm:my-8 sm:min-h-0 sm:rounded-[28px] sm:px-7 sm:shadow-sm">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 text-sm font-medium text-gray-500"
        >
          ← 返回 CK-Bridge
        </button>

        {/* 제목 */}
        <section>
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            🇰🇷 Korean Study
          </div>

          <h1 className="text-[30px] font-bold leading-tight text-gray-950">
            一起学韩语
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-gray-500">
            选择适合你的韩语水平
          </p >
        </section>

        {/* 레벨 선택 */}
        <section className="mt-10 space-y-4">

          {/* 초급 */}
          <button
            type="button"
            onClick={() => router.push("/korean/beginner")}
            className="w-full rounded-2xl border border-green-100 bg-green-50 p-5 text-left transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-green-600">
                  BEGINNER
                </div>

                <div className="mt-2 text-xl font-bold text-gray-950">
                  🌱 初级
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  从最基础的韩语开始学习
                  <br />
                  单词 · 汉字词 · 基础语法
                </p >
              </div>

              <span className="ml-4 text-2xl text-gray-400">
                ›
              </span>
            </div>
          </button>

          {/* 중급 */}
          <button
            type="button"
            onClick={() => router.push("/korean/intermediate")}
            className="w-full rounded-2xl border border-blue-100 bg-blue-50 p-5 text-left transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-blue-600">
                  INTERMEDIATE
                </div>

                <div className="mt-2 text-xl font-bold text-gray-950">
                  📘 中级
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  学习更自然的韩语表达
                  <br />
                  会话 · 语法 · 实用表达
                </p >
              </div>

              <span className="ml-4 text-2xl text-gray-400">
                ›
              </span>
            </div>
          </button>

          {/* 고급 */}
          <button
            type="button"
            onClick={() => router.push("/korean/advanced")}
            className="w-full rounded-2xl border border-purple-100 bg-purple-50 p-5 text-left transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-purple-600">
                  ADVANCED
                </div>

                <div className="mt-2 text-xl font-bold text-gray-950">
                  🎓 高级
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  学习更丰富、更自然的韩语
                  <br />
                  高级表达 · 阅读 · 词汇
                </p >
              </div>

              <span className="ml-4 text-2xl text-gray-400">
                ›
              </span>
            </div>
          </button>

        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          천천히 하나씩 공부해요 🇰🇷
        </p >

      </div>
    </main>
  );
}