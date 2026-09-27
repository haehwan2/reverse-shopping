"use client";

import { useRouter } from "next/navigation";

const lessons = [
  {
    id: "ot",
    number: "OT",
    title: "为什么会中文，学韩语会更容易？",
    description: "了解韩语、中文和汉字之间的关系",
    tags: ["汉字词", "韩文"],
    path: "/korean/beginner/ot",
  },
  {
    id: "lesson-1",
    number: "第1课",
    title: "从汉字开始学韩语单词",
    description: "利用中文学习第一组韩语单词",
    tags: ["등산", "방학", "박물관", "우산"],
    path: "/korean/beginner/lesson-1",
  },
  {
    id: "lesson-2",
    number: "第2课",
    title: "生活中常用的韩语单词",
    description: "学习15个常用单词，并继续利用中文理解韩语汉字词",
    tags: ["고향", "지하철", "생활", "괜찮다"],
    path: "/korean/beginner/lesson-2",
  },
];

export default function BeginnerPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto min-h-screen max-w-md bg-white px-5 pb-12 pt-6 sm:my-8 sm:min-h-0 sm:rounded-[28px] sm:px-7 sm:shadow-sm">

        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() => router.push("/korean")}
          className="mb-8 text-sm font-medium text-gray-500"
        >
          ← 返回
        </button>

        {/* 제목 */}
        <header>
          <div className="mb-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            🌱 BEGINNER
          </div>

          <h1 className="text-[30px] font-bold text-gray-950">
            初级韩语
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-gray-500">
            选择你想学习的课程
            <br />
            不需要按照顺序学习 😊
          </p >
        </header>

        {/* 강의 개수 */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-950">
            课程列表
          </h2>

          <span className="text-xs text-gray-400">
            {lessons.length} 个课程
          </span>
        </div>

        {/* 강의 목록 */}
        <section className="mt-4 space-y-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => router.push(lesson.path)}
              className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">

                <div className="min-w-0 flex-1 pr-4">
                  {/* 강의 번호 */}
                  <div className="text-xs font-bold text-blue-600">
                    {lesson.number}
                  </div>

                  {/* 강의 제목 */}
                  <h3 className="mt-2 text-lg font-bold leading-7 text-gray-950">
                    {lesson.title}
                  </h3>

                  {/* 설명 */}
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {lesson.description}
                  </p >
                </div>

                <span className="mt-2 text-2xl text-gray-300">
                  ›
                </span>
              </div>

              {/* 태그 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4 text-right">
                <span className="text-sm font-semibold text-gray-800">
                  开始学习 →
                </span>
              </div>
            </button>
          ))}
        </section>

      </div>
    </main>
  );
}