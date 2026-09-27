"use client";

import { useRouter } from "next/navigation";

export default function OTPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f6f7f9] print:bg-white">
      <article className="mx-auto min-h-screen max-w-2xl bg-white px-6 pb-16 pt-6 sm:my-8 sm:min-h-0 sm:rounded-[28px] sm:px-10 sm:py-10 sm:shadow-sm print:m-0 print:max-w-none print:px-8 print:shadow-none">

        {/* 상단 메뉴 */}
        <div className="mb-10 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => router.push("/korean/beginner")}
            className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← 课程列表
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            📄 保存为 PDF
          </button>
        </div>

        {/* 제목 */}
        <header className="border-b border-gray-100 pb-8">
          <div className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            🌱 BEGINNER · OT
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-950">
            为什么会中文，
            <br />
            学韩语会更容易？
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-gray-500">
            利用你已经会的中文，
            <br className="sm:hidden" />
            更简单地开始学习韩语。
          </p >
        </header>

        {/* 01 */}
        <LessonSection
          number="01"
          title="韩国和汉字"
        >
          <p>
            韩国也有很长时间使用汉字的历史。
          </p >

          <p>
            所以，现代韩语里有非常多的汉字词。
          </p >
        </LessonSection>

        {/* 02 */}
        <LessonSection
          number="02"
          title="利用中文学习韩语"
        >
          <p>
            因此，如果你会中文，其实有很多韩语单词可以和你已经认识的中文词联系起来学习。
          </p >

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <WordRow chinese="健康" korean="건강" />
            <WordRow chinese="文化" korean="문화" />
            <WordRow chinese="社会" korean="사회" />
            <WordRow chinese="经济" korean="경제" />
            <WordRow chinese="大学" korean="대학" />
            <WordRow chinese="准备" korean="준비" last />
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-[15px] leading-7 text-blue-900">
            💡 像这样的词有很多。它们使用相同或者相近的汉字，
            意思也比较接近。
          </div>
        </LessonSection>

        {/* 03 */}
        <LessonSection
          number="03"
          title="汉字也有韩语读音"
        >
          <p>
            当然，中文和韩语的发音并不一样，但是很多时候可以发现一些比较固定的对应关系。
          </p >

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <HanjaCard hanja="山" korean="산" />
            <HanjaCard hanja="海" korean="해" />
            <HanjaCard hanja="人" korean="인" />
            <HanjaCard hanja="民" korean="민" />
            <HanjaCard hanja="学" korean="학" />
          </div>

          <p className="mt-6">
            如果慢慢熟悉这些汉字在韩语里的读音，以后即使遇到第一次见到的韩语单词，也有可能猜出它的大概意思。
          </p >
        </LessonSection>

        {/* 04 */}
        <LessonSection
          number="04"
          title="试着猜一猜"
        >
          <p>
            比如，你本来就知道“大学”这个词，然后又知道：
          </p >

          <div className="mt-6 rounded-2xl bg-blue-50 p-6">
            <div className="space-y-3">
              <CharacterExample hanja="大" korean="대" />
              <CharacterExample hanja="学" korean="학" />
            </div>

            <div className="my-6 border-t border-blue-100" />

            <div className="text-center">
              <p className="text-sm font-semibold text-blue-700">
                那么……
              </p >

              <div className="mt-4 text-3xl font-bold text-gray-950">
                大学
              </div>

              <div className="my-2 text-xl text-blue-300">
                ↓
              </div>

              <div className="text-4xl font-bold text-blue-700">
                대학
              </div>
            </div>
          </div>

          <p className="mt-6">
            这个单词就会很容易记住。
          </p >

          <p>
            还有像：
          </p >

          <div className="mt-4 flex items-center justify-center rounded-2xl border border-gray-200 px-5 py-6">
            <span className="text-2xl font-bold text-gray-950">
              海边
            </span>

            <span className="mx-5 text-xl text-gray-300">
              →
            </span>

            <span className="text-3xl font-bold text-blue-600">
              해변
            </span>
          </div>

          <p className="mt-5">
            这样的词，在中文和韩语中也使用相同的汉字。
          </p >
        </LessonSection>

        {/* 05 */}
        <LessonSection
          number="05"
          title="但是，也有不同的地方"
        >
          <p>
            不过，并不是所有韩语汉字词都和现代汉语完全一样。
          </p >

          <p>
            比如：
          </p >

          <div className="mt-5 rounded-2xl bg-orange-50 p-6">
            <div className="text-xs font-bold text-orange-700">
              ⚠️ 注意
            </div>

            <div className="mt-5">
              <div className="text-sm text-gray-500">
                韩语
              </div>

              <div className="mt-1 text-2xl font-bold text-gray-950">
                금일（今日）
              </div>

              <div className="mt-2 text-sm text-gray-600">
                = “今天”的意思
              </div>
            </div>

            <div className="my-5 border-t border-orange-100" />

            <div>
              <div className="text-sm text-gray-500">
                现代汉语
              </div>

              <div className="mt-1 text-2xl font-bold text-gray-950">
                今天
              </div>
            </div>
          </div>

          <p className="mt-6">
            也就是说，韩语和中文虽然都受到了汉字文化的影响，但是随着时间的发展，
            有些单词和表达方式也逐渐变得不一样了。
          </p >
        </LessonSection>

        {/* 06 */}
        <LessonSection
          number="06"
          title="现在韩国使用韩文"
        >
          <p>
            韩国过去曾经广泛使用汉字，但是现在大部分韩语都是用一种叫作
            “한글（韩文）”的文字来书写的。
          </p >

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 py-8 text-center">
            <div className="text-5xl font-bold tracking-tight text-gray-950">
              한글
            </div>

            <div className="mt-3 text-sm text-gray-500">
              韩文
            </div>
          </div>
        </LessonSection>

        {/* 07 */}
        <LessonSection
          number="07"
          title="我们要怎么学？"
        >
          <div className="rounded-2xl bg-gray-950 p-6 text-white print:border print:border-gray-200 print:bg-white print:text-black">
            <p className="leading-8">
              我在学习中文的时候发现，把韩语和中文这样联系起来记，会容易很多。
            </p >

            <p className="mt-4 leading-8">
              所以，我想把这个方法反过来，用我学习中文时觉得比较容易理解的方法来给你讲韩语。
            </p >
          </div>
        </LessonSection>

        {/* 완료 */}
        <section className="mt-16 border-t border-gray-100 pt-10 text-center">
          <div className="text-4xl">
            🎉
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-950">
            OT 完成！
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            现在可以去课程列表，
            <br />
            自由选择你想学习的内容。
          </p >

          <button
            type="button"
            onClick={() => router.push("/korean/beginner")}
            className="mt-7 rounded-xl bg-gray-950 px-7 py-3 text-sm font-bold text-white transition hover:bg-gray-800 print:hidden"
          >
            ← 返回课程列表
          </button>
        </section>

      </article>
    </main>
  );
}


/* =========================
   공통 UI
========================= */

function LessonSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 break-inside-avoid">
      <div className="text-xs font-bold tracking-[0.18em] text-blue-600">
        {number}
      </div>

      <h2 className="mt-2 text-2xl font-bold text-gray-950">
        {title}
      </h2>

      <div className="mt-5 space-y-4 text-[16px] leading-8 text-gray-700">
        {children}
      </div>
    </section>
  );
}


function WordRow({
  chinese,
  korean,
  last = false,
}: {
  chinese: string;
  korean: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center px-5 py-4 ${
        last ? "" : "border-b border-gray-100"
      }`}
    >
      <div className="flex-1 text-lg font-semibold text-gray-900">
        {chinese}
      </div>

      <div className="px-4 text-gray-300">
        →
      </div>

      <div className="flex-1 text-right text-xl font-bold text-gray-950">
        {korean}
      </div>
    </div>
  );
}


function HanjaCard({
  hanja,
  korean,
}: {
  hanja: string;
  korean: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center">
      <div className="text-2xl font-bold text-gray-950">
        {hanja}
      </div>

      <div className="mt-2 text-lg font-bold text-blue-600">
        {korean}
      </div>
    </div>
  );
}


function CharacterExample({
  hanja,
  korean,
}: {
  hanja: string;
  korean: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <span className="w-16 text-right text-2xl font-bold text-gray-950">
        {hanja}
      </span>

      <span className="mx-5 text-gray-300">
        →
      </span>

      <span className="w-16 text-left text-2xl font-bold text-blue-700">
        {korean}
      </span>
    </div>
  );
}