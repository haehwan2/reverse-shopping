"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function Lesson1Page() {
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
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
            🌱 BEGINNER · 第1课
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-950">
            单词 1
          </h1>

          <p className="mt-3 text-[15px] leading-7 text-gray-500">
            利用中文和汉字，更容易地学习韩语单词。
            <br />
            点击 🔊 可以听韩语发音。
          </p>
        </header>

        {/* ================================
            전체 단어 목록
        ================================= */}
        <section className="mt-12">
          <div className="text-xs font-bold tracking-[0.18em] text-blue-600">
            WORD LIST
          </div>

          <h2 className="mt-2 text-2xl font-bold text-gray-950">
            今天的单词
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            先看一遍，不需要一次全部记住。
            <br />
            点击右边的 🔊 可以听发音。
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
            <WordRow korean="등산" hanja="登山" chinese="爬山" />
            <WordRow korean="방학" hanja="放学" chinese="假期" />
            <WordRow korean="박물관" hanja="博物館" chinese="博物馆" />
            <WordRow korean="일하다" chinese="工作" />
            <WordRow korean="먼저" chinese="先" />
            <WordRow korean="이름" chinese="名字" />
            <WordRow korean="알리다" chinese="告诉，通知" />
            <WordRow korean="바다" chinese="海" />
            <WordRow korean="생각" chinese="想法" />
            <WordRow korean="모르다" chinese="不知道" />
            <WordRow korean="힘들다" chinese="累" />
            <WordRow korean="찍다" chinese="拍" />
            <WordRow korean="건강" hanja="健康" chinese="健康" />
            <WordRow
              korean="우산"
              hanja="雨傘"
              chinese="伞"
              last
            />
          </div>
        </section>

        {/* ================================
            01 등산
        ================================= */}
        <LessonSection
          number="01"
          title="등산（登山）"
          meaning="爬山"
          pronunciation="등산"
        >
          <p>
            在中文日常会话里，说“上山、爬山”的时候，一般更常说
            “爬山”。
          </p>

          <p>
            而在韩语里，我们经常使用
            <Strong> 등산（登山）</Strong> 这个汉字词。
          </p>

          <HanjaBox
            items={[
              ["登", "등"],
              ["山", "산"],
            ]}
            result="登山 → 등산"
          />

          <p>
            所以韩语里会说 <Strong>등산하다</Strong>，
            意思就是“爬山”。
          </p>

          <Example
            korean="주말에 등산해요."
            chinese="周末去爬山。"
          />

          <Example
            korean="저는 등산을 좋아해요."
            chinese="我喜欢爬山。"
          />

          <Tip>
            中文里其实也有“登山”这个词，只是在日常生活中“爬山”更常用。
            像这样，即使韩语和中文里都有相同的汉字，
            实际生活中经常使用的词也可能不一样。
          </Tip>
        </LessonSection>

        {/* ================================
            02 방학
        ================================= */}
        <LessonSection
          number="02"
          title="방학（放学）"
          meaning="假期"
          pronunciation="방학"
        >
          <p>
            방학也是一个很有意思的词，因为它在韩语和现代汉语里的意思已经不一样了。
          </p>

          <p>
            韩语的 <Strong>방학</Strong> 写成汉字是
            <Strong> “放学”</Strong>。
          </p>

          <CompareBox
            leftTitle="🇨🇳 现代汉语"
            left="放学 = 下课、学生放学回家"
            rightTitle="🇰🇷 韩语"
            right="방학 = 放假、假期"
          />

          <Example
            korean="여름방학"
            chinese="暑假"
          />

          <Example
            korean="겨울방학"
            chinese="寒假"
          />

          <Example
            korean="방학에 중국에 갈 거예요."
            chinese="假期我要去中国。"
          />

          <Tip>
            即使使用的是相同的汉字，
            现代韩语和现代汉语里的意思也不一定完全一样。
          </Tip>
        </LessonSection>

        {/* ================================
            03 박물관
        ================================= */}
        <LessonSection
          number="03"
          title="박물관（博物館）"
          meaning="博物馆"
          pronunciation="박물관"
        >
          <p>
            박물관就比较容易理解了。
          </p>

          <p>
            中文的“博物馆”和韩语的
            <Strong> 박물관（博物館）</Strong>
            使用的是相同的汉字，而且意思也一样。
          </p>

          <HanjaBox
            items={[
              ["博", "박"],
              ["物", "물"],
              ["館", "관"],
            ]}
            result="博物館 → 박물관"
          />

          <Example
            korean="박물관에 가요."
            chinese="去博物馆。"
          />

          <Example
            korean="박물관에서 사진을 찍어요."
            chinese="在博物馆拍照。"
          />

          <Tip>
            像这种单词，如果你本来就会中文，
            其实几乎不用重新记它的意思。
            只要把已经知道的汉字词和它的韩语发音联系起来记就可以了。
          </Tip>
        </LessonSection>

        {/* ================================
            04 먼저 / 선배
        ================================= */}
        <LessonSection
          number="04"
          title="먼저 / 先 / 선배（先輩）"
          meaning="先"
          pronunciation="먼저"
        >
          <p>
            <Strong>먼저</Strong> 是韩语的固有词。
          </p>

          <p>
            根据不同的语境，可以理解成中文的“先、首先”。
          </p>

          <Example
            korean="먼저 먹어."
            chinese="你先吃。"
          />

          <Example
            korean="먼저 가세요."
            chinese="您先走。"
          />

          <Example
            korean="내가 먼저 할게."
            chinese="我先来。"
          />

          <p>
            然后，中文里的“先”这个汉字，在韩语里读作
            <Strong> “선”</Strong>。
          </p>

          <HanjaBox
            items={[
              ["先", "선"],
              ["輩", "배"],
            ]}
            result="先輩 → 선배"
          />

          <p>
            中文一般会说“前辈”，但是韩语使用的是“先輩”，
            读作 <Strong>선배</Strong>。
          </p>

          <div className="mt-5 space-y-3">
            <PronunciationCard
              korean="선배"
              hanja="先輩"
              chinese="前辈"
            />

            <PronunciationCard
              korean="후배"
              hanja="後輩"
              chinese="后辈"
            />
          </div>
        </LessonSection>

        {/* ================================
            05 알리다
        ================================= */}
        <LessonSection
          number="05"
          title="알리다 / 알려주다 / 통지（通知）"
          meaning="告诉 · 通知"
          pronunciation="알리다"
        >
          <p>
            <Strong>알리다</Strong>
            也是韩语里经常使用的一个词。
          </p>

          <p>
            알리다的意思是把某件事情或者某个信息告诉别人，让别人知道。
          </p>

          <Example
            korean="결과를 알리다."
            chinese="告知结果。"
          />

          <Example
            korean="소식을 알리다."
            chinese="告知消息。"
          />

          <p>
            不过，在日常会话中，
            <Strong> 알려주다</Strong> 这个表达也非常常用。
          </p>

          <Example
            korean="내가 알려줄게."
            chinese="我告诉你。"
          />

          <Example
            korean="전화번호 좀 알려주세요."
            chinese="请告诉我电话号码。"
          />

          <Example
            korean="내가 한국어 알려줄게."
            chinese="我来教你韩语 / 我来告诉你韩语怎么说。"
          />

          <Tip>
            알리다和 알려주다虽然有关系，
            但是具体的使用方法有一点不同。
          </Tip>

          <p>
            另外，在比较正式的场合或者正式文件中，
            韩语也会使用和中文一样的汉字词“通知”。
          </p>

          <HanjaBox
            items={[
              ["通", "통"],
              ["知", "지"],
            ]}
            result="通知 → 통지"
          />

          <PronunciationCard
            korean="통지"
            hanja="通知"
            chinese="通知"
          />

          <PronunciationCard
            korean="통지서"
            hanja="通知書"
            chinese="通知书"
          />

          <p>
            如果以后在韩国生活，在各种正式文件里可能会看到
            통지或者 통지서这样的词。
          </p>
        </LessonSection>

        {/* ================================
            06 바다
        ================================= */}
        <LessonSection
          number="06"
          title="바다 / 海"
          meaning="海"
          pronunciation="바다"
        >
          <p>
            <Strong>바다</Strong>
            不是汉字词，而是韩语的固有词，
            意思就是中文的“海、大海”。
          </p>

          <p>
            日常生活中一般直接说 바다。
          </p>

          <Example
            korean="바다 보러 가자."
            chinese="我们去看海吧。"
          />

          <Example
            korean="나는 바다를 좋아해."
            chinese="我喜欢大海。"
          />

          <Example
            korean="바다가 예뻐요."
            chinese="大海很漂亮。"
          />

          <p>
            但是，在很多和“海”有关的汉字词里，
            你会看到中文的“海”这个字。
          </p>

          <div className="mt-6 rounded-2xl bg-blue-50 p-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-950">
                海
              </span>

              <span className="mx-4 text-gray-400">
                →
              </span>

              <span className="text-3xl font-bold text-blue-700">
                해
              </span>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <WordRow
              korean="해변"
              hanja="海邊"
              chinese="海边"
            />

            <WordRow
              korean="해산물"
              hanja="海産物"
              chinese="海产品"
            />

            <WordRow
              korean="해외"
              hanja="海外"
              chinese="海外"
            />

            <WordRow
              korean="해양"
              hanja="海洋"
              chinese="海洋"
              last
            />
          </div>

          <p>
            比如，假设你第一次看到
            <Strong>“해외（海外）”</Strong>
            这个韩语单词。
          </p>

          <HanjaBox
            items={[
              ["海", "해"],
              ["外", "외"],
            ]}
            result="海外 → 해외"
          />

          <Tip>
            如果你已经知道“海 → 해、外 → 외”，
            就可以把“해외”和中文的“海外”联系起来，
            然后猜到这个单词的意思。
          </Tip>
        </LessonSection>

        {/* ================================
            07 모르다
        ================================= */}
        <LessonSection
          number="07"
          title="모르다 → 몰라요"
          meaning="不知道"
          pronunciation="모르다"
        >
          <p>
            모르다这个词你应该听过很多次。
          </p>

          <p>
            如果你看韩剧的话，应该经常听到：
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <PronunciationCard
              korean="몰라"
              chinese="不知道（非敬语）"
            />

            <PronunciationCard
              korean="몰라요"
              chinese="不知道（礼貌）"
            />
          </div>

          <p>
            其实它们并不是不同的单词。
          </p>

          <p>
            <Strong>모르다</Strong> 才是这个词的基本形。
          </p>

          <p>
            在韩语词典或者单词表里，
            动词一般都会以基本形出现。
          </p>

          <div className="mt-6 space-y-3">
            <ChangeRow
              from="모르다"
              to="몰라요"
              note="礼貌表达"
            />

            <ChangeRow
              from="모르다"
              to="몰라"
              note="非敬语"
            />

            <ChangeRow
              from="모르다"
              to="모릅니다"
              note="比较正式"
            />
          </div>

          <Example
            korean="저는 몰라요."
            chinese="我不知道。"
          />

          <Example
            korean="나도 몰라."
            chinese="我也不知道。"
          />

          <p>
            所以以后学习韩语单词的时候，
            你会发现很多单词都是以“-다”结尾的。
          </p>

          <div className="mt-5 space-y-3">
            <ChangeRow
              from="먹다"
              to="먹어요"
              note="吃"
            />

            <ChangeRow
              from="가다"
              to="가요"
              note="去"
            />

            <ChangeRow
              from="일하다"
              to="일해요"
              note="工作"
            />

            <ChangeRow
              from="찍다"
              to="찍어요"
              note="拍"
            />
          </div>

          <Tip>
            如果你在单词表里学的是“모르다”，
            但是在韩剧里听到的是“몰라”或者“몰라요”，
            不要以为它们是不同的单词。
            这一点对以后学习韩语非常重要。
          </Tip>
        </LessonSection>

        {/* ================================
            08 우산
        ================================= */}
        <LessonSection
          number="08"
          title="우산（雨傘）"
          meaning="伞"
          pronunciation="우산"
        >
          <p>
            中文日常生活中一般直接说“伞”。
          </p>

          <p>
            但是韩语里说：
            <Strong> 우산（雨傘）</Strong>
          </p>

          <HanjaBox
            items={[
              ["雨", "우"],
              ["傘", "산"],
            ]}
            result="雨傘 → 우산"
          />

          <Example
            korean="비가 와요. 우산을 가져가세요."
            chinese="下雨了，请带上雨伞。"
          />

          <Example
            korean="우산이 없어요."
            chinese="我没有雨伞。"
          />

          <p>
            这里还有一个可以记住的地方：
          </p>

          <div className="mt-5 rounded-2xl bg-blue-50 p-6 text-center">
            <div className="text-3xl font-bold text-gray-950">
              雨
              <span className="mx-4 text-gray-300">
                →
              </span>
              <span className="text-blue-700">
                우
              </span>
            </div>
          </div>

          <Tip>
            在韩语的汉字音里，“雨”读作“우”。
            所以以后如果你在其他韩语汉字词里再次看到“雨”，
            就可以想到这个字在韩语里可能读作“우”。
          </Tip>

          <p>
            这样以后遇到新的汉字词时，
            就可以慢慢利用你已经会的中文去推测韩语单词的意思和读音。
          </p>
        </LessonSection>

        {/* ================================
            완료
        ================================= */}
        <section className="mt-16 border-t border-gray-100 pt-10 text-center">
          <div className="text-4xl">
            🎉
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-950">
            第1课 完成！
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            不需要一次全部记住。
            <br />
            可以多听几次发音，以后再回来复习。
          </p>

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


/* =========================================================
   발음
========================================================= */

function PronunciationButton({
  text,
  label = "听发音",
}: {
  text: string;
  label?: string;
}) {
  const speak = () => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      alert("这个浏览器暂时不支持语音播放。");
      return;
    }

    // 이전 음성이 재생 중이면 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ko-KR";

    // 초보자용으로 조금 천천히
    utterance.rate = 0.8;

    utterance.pitch = 1;
    utterance.volume = 1;

    // 가능한 경우 한국어 음성 선택
    const voices = window.speechSynthesis.getVoices();

    const koreanVoice = voices.find(
      (voice) =>
        voice.lang === "ko-KR" ||
        voice.lang.toLowerCase().startsWith("ko")
    );

    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      className="print:hidden inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 active:scale-95"
    >
      <span>🔊</span>
      <span>{label}</span>
    </button>
  );
}


/* =========================================================
   강의 섹션
========================================================= */

function LessonSection({
  number,
  title,
  meaning,
  pronunciation,
  children,
}: {
  number: string;
  title: string;
  meaning: string;
  pronunciation?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="text-xs font-bold tracking-[0.18em] text-blue-600">
        {number}
      </div>

      <div className="mt-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-950">
            {title}
          </h2>

          {pronunciation && (
            <PronunciationButton
              text={pronunciation}
              label="听发音"
            />
          )}
        </div>

        <div className="mt-1 text-sm text-gray-400">
          {meaning}
        </div>
      </div>

      <div className="mt-6 space-y-4 text-[16px] leading-8 text-gray-700">
        {children}
      </div>
    </section>
  );
}


/* =========================================================
   강조
========================================================= */

function Strong({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="font-bold text-gray-950">
      {children}
    </span>
  );
}


/* =========================================================
   단어 목록
========================================================= */

function WordRow({
  korean,
  chinese,
  hanja,
  last = false,
}: {
  korean: string;
  chinese: string;
  hanja?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 ${
        last ? "" : "border-b border-gray-100"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="font-bold text-gray-950">
          {korean}
        </div>

        {hanja && (
          <div className="mt-0.5 text-xs text-gray-400">
            {hanja}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        {chinese}
      </div>

      <PronunciationButton
        text={korean}
        label="听"
      />
    </div>
  );
}


/* =========================================================
   발음 단어 카드
========================================================= */

function PronunciationCard({
  korean,
  chinese,
  hanja,
}: {
  korean: string;
  chinese: string;
  hanja?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-gray-950">
            {korean}
          </div>

          {hanja && (
            <div className="mt-0.5 text-xs text-gray-400">
              {hanja}
            </div>
          )}

          <div className="mt-1 text-sm text-gray-500">
            {chinese}
          </div>
        </div>

        <PronunciationButton
          text={korean}
          label="听"
        />
      </div>
    </div>
  );
}


/* =========================================================
   예문
========================================================= */

function Example({
  korean,
  chinese,
}: {
  korean: string;
  chinese: string;
}) {
  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-lg font-bold leading-7 text-gray-950">
            {korean}
          </div>

          <div className="mt-1 text-sm leading-6 text-gray-500">
            {chinese}
          </div>
        </div>

        <PronunciationButton
          text={korean}
          label="听句子"
        />
      </div>
    </div>
  );
}


/* =========================================================
   TIP
========================================================= */

function Tip({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-5 rounded-xl bg-blue-50 p-5 text-[15px] leading-7 text-blue-900">
      <span className="mr-1">
        💡
      </span>
      {children}
    </div>
  );
}


/* =========================================================
   한자 → 한국 한자음
========================================================= */

function HanjaBox({
  items,
  result,
}: {
  items: [string, string][];
  result: string;
}) {
  return (
    <div className="mt-6 rounded-2xl bg-gray-50 p-6">
      <div className="space-y-3">
        {items.map(([hanja, korean]) => (
          <div
            key={`${hanja}-${korean}`}
            className="flex items-center justify-center text-xl"
          >
            <span className="w-16 text-right font-bold text-gray-950">
              {hanja}
            </span>

            <span className="mx-5 text-gray-300">
              →
            </span>

            <span className="w-16 font-bold text-blue-600">
              {korean}
            </span>

            <div className="ml-3 print:hidden">
              <PronunciationButton
                text={korean}
                label="听"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="my-5 border-t border-gray-200" />

      <div className="text-center text-xl font-bold text-gray-950">
        {result}
      </div>
    </div>
  );
}


/* =========================================================
   중국어 / 한국어 비교
========================================================= */

function CompareBox({
  leftTitle,
  left,
  rightTitle,
  right,
}: {
  leftTitle: string;
  left: string;
  rightTitle: string;
  right: string;
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-gray-50 p-5">
        <div className="text-xs font-bold text-gray-500">
          {leftTitle}
        </div>

        <div className="mt-2 text-sm font-semibold leading-6 text-gray-900">
          {left}
        </div>
      </div>

      <div className="rounded-xl bg-blue-50 p-5">
        <div className="text-xs font-bold text-blue-600">
          {rightTitle}
        </div>

        <div className="mt-2 text-sm font-semibold leading-6 text-gray-900">
          {right}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   동사 변화
========================================================= */

function ChangeRow({
  from,
  to,
  note,
}: {
  from: string;
  to: string;
  note: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-gray-950">
          {from}
        </span>

        <span className="text-gray-300">
          →
        </span>

        <span className="font-bold text-blue-600">
          {to}
        </span>

        <span className="ml-auto text-xs text-gray-400">
          {note}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <PronunciationButton
          text={from}
          label="基本形"
        />

        <PronunciationButton
          text={to}
          label="听变化"
        />
      </div>
    </div>
  );
}