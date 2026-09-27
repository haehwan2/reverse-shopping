"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function Lesson2Page() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#f6f7f9] print:bg-white">
            <article className="mx-auto min-h-screen max-w-2xl bg-white px-6 pb-16 pt-6 sm:my-8 sm:min-h-0 sm:rounded-[28px] sm:px-10 sm:py-10 sm:shadow-sm print:m-0 print:max-w-none print:px-8 print:shadow-none">

                {/* 상단 */}
                <div className="mb-10 flex items-center justify-between print:hidden">
                    <button
                        type="button"
                        onClick={() => router.push("/korean/beginner")}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        ← 课程列表
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
                    >
                        📄 保存为 PDF
                    </button>
                </div>

                {/* 제목 */}
                <header className="border-b border-gray-100 pb-8">
                    <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                        🌱 BEGINNER · 第2课
                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-gray-950">
                        单词 2
                    </h1>

                    <p className="mt-3 text-[15px] leading-7 text-gray-500">
                        这次我们继续学习生活中经常使用的韩语单词。
                        <br />
                        有些词可以用汉字和中文来理解，
                        有些则是需要直接记住的韩语固有词。
                    </p>
                </header>

                {/* 단어 전체 */}
                <section className="mt-12">
                    <div className="text-xs font-bold tracking-[0.18em] text-blue-600">
                        WORD LIST
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-gray-950">
                        今天的15个单词
                    </h2>

                    <p className="mt-3 text-sm text-gray-500">
                        点击 🔊 可以听韩语发音。
                    </p>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                        <WordRow korean="괜찮다" chinese="没关系 / 不错 / 可以" />
                        <WordRow korean="고향" hanja="故鄕" chinese="故乡 / 家乡" />
                        <WordRow korean="쉽다" chinese="容易" />
                        <WordRow korean="구경하다" chinese="参观 / 看一看 / 游览" />
                        <WordRow korean="빌리다" chinese="借（借进来）" />
                        <WordRow korean="정말" chinese="真的 / 真" />
                        <WordRow korean="대하다" chinese="对待 / 面对" />
                        <WordRow korean="지하철" hanja="地下鐵" chinese="地铁" />
                        <WordRow korean="팔다" chinese="卖" />
                        <WordRow korean="책상" hanja="冊床" chinese="书桌" />
                        <WordRow korean="장소" hanja="场所" chinese="场所 / 地点" />
                        <WordRow korean="모자" hanja="帽子" chinese="帽子" />
                        <WordRow korean="빨리" chinese="快 / 快点" />
                        <WordRow korean="생활" hanja="生活" chinese="生活" />
                        <WordRow korean="비싸다" chinese="贵" last />
                    </div>
                </section>

                {/* 01 괜찮다 */}
                <LessonSection
                    number="01"
                    title="괜찮다"
                    meaning="没关系 · 可以 · 不错"
                    pronunciation="괜찮다"
                >
                    <p>
                        <Strong>괜찮다</Strong> 是一个非常常用的韩语单词。
                        但是它不能只对应一个中文意思。
                    </p>

                    <CompareList
                        items={[
                            ["괜찮아요.", "没关系。 / 可以。"],
                            ["저는 괜찮아요.", "我没事。 / 我可以。"],
                            ["이거 괜찮아요?", "这个可以吗？ / 这个怎么样？"],
                        ]}
                    />

                    <Tip>
                        所以听到“괜찮아요”时，不要只记成“okay”。
                        要根据具体情况理解成“没关系、没事、可以、还不错”等意思。
                    </Tip>
                </LessonSection>

                {/* 02 고향 */}
                <LessonSection
                    number="02"
                    title="고향（故乡）"
                    meaning="故乡 · 家乡"
                    pronunciation="고향"
                >
                    <p>
                        这个词对会中文的人来说很好记。
                    </p>

                    <HanjaBox
                        items={[
                            ["故", "고"],
                            ["乡", "향"],
                        ]}
                        result="故乡 → 고향"
                    />

                    <p>
                        中文里有“故乡”，韩语里的
                        <Strong> 고향</Strong> 也是“家乡”的意思。
                    </p>

                    <Example
                        korean="고향이 어디예요?"
                        chinese="你的家乡在哪里？"
                    />

                    <Example
                        korean="제 고향은 부산이에요."
                        chinese="我的家乡是釜山。"
                    />
                </LessonSection>

                {/* 03 쉽다 */}
                <LessonSection
                    number="03"
                    title="쉽다"
                    meaning="容易 · 简单"
                    pronunciation="쉽다"
                >
                    <p>
                        <Strong>쉽다</Strong> 的意思是“容易、简单”。
                    </p >

                    <p>
                        实际说话的时候，经常会听到
                        <Strong> 쉬워요</Strong>。
                    </p >

                    <ChangeRow
                        from="쉽다"
                        to="쉬워요"
                        note="容易"
                    />

                    <Example
                        korean="한국어가 쉬워요."
                        chinese="韩语很容易。"
                    />

                    <Example
                        korean="이 문제는 쉬워요."
                        chinese="这个问题很简单。"
                    />

                    <Tip>
                        单词表里看到的是“쉽다”，
                        但实际日常对话里更容易听到“쉬워요”。
                    </Tip>

                    {/* 용이하다 설명 */}
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-bold text-gray-950">
                            용이하다（容易하다）
                        </h3>

                        <div className="mt-3">
                            <PronunciationButton
                                text="용이하다"
                                label="听发音"
                            />
                        </div>

                        <p className="mt-5">
                            另外，韩语里还有
                            <Strong> 용이하다</Strong> 这个词。
                        </p >

                        <p>
                            它和中文的
                            <Strong>“容易”</Strong>
                            有直接的汉字联系。
                        </p >

                        <HanjaBox
                            items={[
                                ["容", "용"],
                                ["易", "이"],
                            ]}
                            result="容易 → 용이 → 용이하다"
                        />

                        <p>
                            <Strong>쉽다</Strong> 和
                            <Strong> 용이하다</Strong>
                            的意思比较接近，但是使用的场合不太一样。
                        </p >

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    💬 日常会话
                                </div>

                                <div className="mt-2 text-lg font-bold text-blue-600">
                                    쉽다 / 쉬워요
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    和朋友聊天或者普通日常会话中更自然。
                                </p >
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    📄 正式、书面表达
                                </div>

                                <div className="mt-2 text-lg font-bold text-blue-600">
                                    용이하다
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    在说明书、新闻、报告、工作文件等比较正式的表达中经常可以看到。
                                </p >
                            </div>
                        </div>

                        <Example
                            korean="사용이 용이하다."
                            chinese="使用方便 / 容易使用。"
                        />

                        <Example
                            korean="접근이 용이하다."
                            chinese="容易接近 / 交通方便。"
                        />

                        <Tip>
                            和朋友聊天的时候，一般使用“쉽다 / 쉬워요”更加自然。
                            以后如果在韩国的文件、新闻或者工作资料里看到“용이하다”，
                            可以想到中文的“容易”，这样会更容易理解。
                        </Tip>
                    </div>
                </LessonSection>

                {/* 04 구경하다 */}
                <LessonSection
                    number="04"
                    title="구경하다"
                    meaning="参观 · 游览 · 看一看"
                    pronunciation="구경하다"
                >
                    <p>
                        <Strong>구경하다</Strong> 可以理解成去一个地方看看、
                        参观或者游览。
                    </p>

                    <Example
                        korean="서울을 구경해요."
                        chinese="游览首尔。"
                    />

                    <Example
                        korean="같이 구경하러 가요."
                        chinese="一起去逛逛吧。"
                    />

                    <Tip>
                        구경하다根据情况可以翻译成“参观、游览、逛、看看”，
                        不需要只记一个中文意思。
                    </Tip>
                </LessonSection>

                {/* 05 빌리다 */}
                <LessonSection
                    number="05"
                    title="빌리다"
                    meaning="借"
                    pronunciation="빌리다"
                >
                    <p>
                        <Strong>빌리다</Strong> 是“借来、借用”的意思。
                    </p>

                    <ChangeRow from="빌리다" to="빌려요" note="借" />

                    <Example
                        korean="책을 빌려요."
                        chinese="借书。"
                    />

                    <Example
                        korean="친구에게 돈을 빌렸어요."
                        chinese="向朋友借了钱。"
                    />

                    <Tip>
                        中文的“借”既可以表示借进来也可以表示借出去，
                        但韩语里要注意方向。빌리다主要是自己从别人那里借来。
                    </Tip>
                </LessonSection>

                {/* 06 정말 */}
                <LessonSection
                    number="06"
                    title="정말"
                    meaning="真的 · 真"
                    pronunciation="정말"
                >
                    <p>
                        <Strong>정말</Strong> 在日常对话里非常常见，
                        相当于中文的“真的、真”。
                    </p>

                    <Example
                        korean="정말 좋아요."
                        chinese="真的很好。"
                    />

                    <Example
                        korean="정말?"
                        chinese="真的？"
                    />

                    <Example
                        korean="정말 맛있어요."
                        chinese="真的很好吃。"
                    />

                    <Tip>
                        看韩剧或者韩国综艺的时候，
                        你会非常经常听到“정말?”。
                    </Tip>
                </LessonSection>

                {/* 07 대하다 */}
                <LessonSection
                    number="07"
                    title="대하다"
                    meaning="对待 · 面对"
                    pronunciation="대하다"
                >
                    <p>
                        <Strong>대하다</Strong> 和汉字“对”有关。
                    </p>

                    <div className="mt-5 rounded-2xl bg-blue-50 p-6 text-center">
                        <span className="text-3xl font-bold">对（對）</span>
                        <span className="mx-4 text-gray-300">→</span>
                        <span className="text-3xl font-bold text-blue-700">대</span>
                    </div>

                    <Example
                        korean="친절하게 대해 주세요."
                        chinese="请友好地对待我。"
                    />

                    <Tip>
                        대하다在不同句子里的翻译会变化，
                        现在先记住“对、对待”这个核心感觉就可以。
                    </Tip>
                </LessonSection>

                {/* 08 지하철 */}
                <LessonSection
                    number="08"
                    title="지하철（地下铁）"
                    meaning="地铁"
                    pronunciation="지하철"
                >
                    <p>
                        这个词非常适合用中文来记。
                    </p>

                    <HanjaBox
                        items={[
                            ["地", "지"],
                            ["下", "하"],
                            ["鐵", "철"],
                        ]}
                        result="地下鐵 → 지하철"
                    />

                    <p>
                        中文“地铁”和韩语“지하철”表达的是同一个东西。
                    </p>

                    <Example
                        korean="지하철을 타요."
                        chinese="坐地铁。"
                    />

                    <Example
                        korean="지하철역이 어디예요?"
                        chinese="地铁站在哪里？"
                    />

                    <Tip>
                        以后看到“地下”相关的韩语汉字词，
                        可以注意“地 → 지、下 → 하”的对应关系。
                    </Tip>
                </LessonSection>

                {/* 09 팔다 */}
                <LessonSection
                    number="09"
                    title="팔다"
                    meaning="卖"
                    pronunciation="팔다"
                >
                    <p>
                        <Strong>팔다</Strong> 就是中文的“卖”。
                    </p>

                    <ChangeRow from="팔다" to="팔아요" note="卖" />

                    <Example
                        korean="옷을 팔아요."
                        chinese="卖衣服。"
                    />

                    <Example
                        korean="이거 팔아요?"
                        chinese="这个卖吗？"
                    />
                </LessonSection>

                {/* 10 책상 */}
                <LessonSection
                    number="10"
                    title="책상"
                    meaning="书桌"
                    pronunciation="책상"
                >
                    <p>
                        <Strong>책상</Strong> 就是学习或者工作时使用的“书桌”。
                    </p>

                    <Example
                        korean="책상 위에 책이 있어요."
                        chinese="书桌上有一本书。"
                    />

                    <Example
                        korean="책상에 앉아요."
                        chinese="坐到书桌前。"
                    />
                </LessonSection>

                {/* 11 장소 */}
                <LessonSection
                    number="11"
                    title="장소（场所）"
                    meaning="场所 · 地点"
                    pronunciation="장소"
                >
                    <p>
                        这个词也可以直接和中文联系起来。
                    </p>

                    <HanjaBox
                        items={[
                            ["场", "장"],
                            ["所", "소"],
                        ]}
                        result="场所 → 장소"
                    />

                    <p>
                        中文的“场所”和韩语的
                        <Strong> 장소</Strong> 意思很接近。
                    </p>

                    <Example
                        korean="장소가 어디예요?"
                        chinese="地点在哪里？"
                    />

                    <Example
                        korean="약속 장소를 정해요."
                        chinese="决定见面的地点。"
                    />
                </LessonSection>

                {/* 12 모자 */}
                <LessonSection
                    number="12"
                    title="모자（帽子）"
                    meaning="帽子"
                    pronunciation="모자"
                >
                    <p>
                        这个词很有意思。
                    </p>

                    <p>
                        中文直接说 <Strong>帽子</Strong>，
                        韩语则读作 <Strong>모자</Strong>。
                    </p>

                    <Example
                        korean="모자를 써요."
                        chinese="戴帽子。"
                    />

                    <Example
                        korean="이 모자 예뻐요."
                        chinese="这顶帽子很好看。"
                    />

                    <Tip>
                        韩语里说“戴帽子”时使用“모자를 쓰다”。
                        所以不要按照中文直接逐字翻译。
                    </Tip>
                </LessonSection>

                {/* 13 빨리 */}
                <LessonSection
                    number="13"
                    title="빨리"
                    meaning="快 · 快点"
                    pronunciation="빨리"
                >
                    <p>
                        <Strong>빨리</Strong> 是韩国日常生活里非常常见的词。
                    </p>

                    <Example
                        korean="빨리 가자."
                        chinese="快走吧。"
                    />

                    <Example
                        korean="빨리 먹어."
                        chinese="快吃。"
                    />

                    <Example
                        korean="빨리 와."
                        chinese="快来。"
                    />

                    <Tip>
                        你以后可能还会听到“빨리빨리”。
                        连续说两次时，有“快点快点”的感觉。
                    </Tip>
                </LessonSection>

                {/* 14 생활 */}
                <LessonSection
                    number="14"
                    title="생활（生活）"
                    meaning="生活"
                    pronunciation="생활"
                >
                    <p>
                        这个词对中国人来说非常容易记。
                    </p>

                    <HanjaBox
                        items={[
                            ["生", "생"],
                            ["活", "활"],
                        ]}
                        result="生活 → 생활"
                    />

                    <p>
                        汉字和中文完全一样，而且意思也非常接近。
                    </p>

                    <Example
                        korean="한국 생활이 어때요?"
                        chinese="在韩国的生活怎么样？"
                    />

                    <Example
                        korean="학교 생활이 재미있어요."
                        chinese="学校生活很有意思。"
                    />

                    <Tip>
                        记住“生 → 생、活 → 활”，
                        以后遇到其他汉字词时也可能会再次看到这些读音。
                    </Tip>
                </LessonSection>

                {/* 15 비싸다 */}
                <LessonSection
                    number="15"
                    title="비싸다"
                    meaning="贵 · 价格高"
                    pronunciation="비싸다"
                >
                    <p>
                        <Strong>비싸다</Strong> 的意思是“价格高、贵”。
                    </p >

                    <p>
                        实际说话的时候，经常会使用
                        <Strong> 비싸요</Strong>。
                    </p >

                    <ChangeRow
                        from="비싸다"
                        to="비싸요"
                        note="贵"
                    />

                    <Example
                        korean="이거 너무 비싸요."
                        chinese="这个太贵了。"
                    />

                    <Example
                        korean="한국에서 과일이 비싸요."
                        chinese="在韩国水果很贵。"
                    />

                    <Tip>
                        如果想表达东西的“价格很贵”，
                        韩语一般使用“비싸다 / 비싸요”。
                    </Tip>

                    {/* 귀하다 설명 */}
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-bold text-gray-950">
                            귀하다（貴하다）
                        </h3>

                        <div className="mt-3">
                            <PronunciationButton
                                text="귀하다"
                                label="听发音"
                            />
                        </div>

                        <p className="mt-5">
                            不过，中文的
                            <Strong>“贵”</Strong>
                            不只有“价格高”的意思。
                        </p >

                        <p>
                            比如“珍贵、宝贵”里的“贵”，
                            在韩语汉字音中读作
                            <Strong> 귀</Strong>。
                        </p >

                        <div className="mt-6 rounded-2xl bg-gray-50 p-6">
                            <div className="flex items-center justify-center text-2xl">
                                <span className="font-bold text-gray-950">
                                    貴
                                </span>

                                <span className="mx-5 text-gray-300">
                                    →
                                </span>

                                <span className="font-bold text-blue-600">
                                    귀
                                </span>

                                <div className="ml-3 print:hidden">
                                    <PronunciationButton
                                        text="귀"
                                        label="听"
                                    />
                                </div>
                            </div>

                            <div className="my-5 border-t border-gray-200" />

                            <div className="text-center text-xl font-bold text-gray-950">
                                貴 → 귀 → 귀하다
                            </div>
                        </div>

                        <p>
                            <Strong>귀하다</Strong> 并不是单纯表示“价格贵”。
                        </p >

                        <p>
                            它主要表示某个东西
                            <Strong> 珍贵、宝贵、难得、不常见</Strong>
                            这样的意思。
                        </p >

                        {/* 비싸다 / 귀하다 비교 */}
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    💰 价格高
                                </div>

                                <div className="mt-2 text-xl font-bold text-blue-600">
                                    비싸다
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    表示商品或东西的价格高。
                                </p >

                                <div className="mt-3">
                                    <PronunciationButton
                                        text="비싸다"
                                        label="听发音"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    💎 珍贵 · 难得
                                </div>

                                <div className="mt-2 text-xl font-bold text-blue-600">
                                    귀하다
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    表示珍贵、宝贵，或者很难得到、很少见。
                                </p >

                                <div className="mt-3">
                                    <PronunciationButton
                                        text="귀하다"
                                        label="听发音"
                                    />
                                </div>
                            </div>
                        </div>

                        <Example
                            korean="물이 귀하다."
                            chinese="水很珍贵 / 水资源稀缺。"
                        />

                        <Example
                            korean="요즘 보기 귀한 물건이에요."
                            chinese="这是现在很难见到的东西。"
                        />

                        <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                            <div className="text-sm font-bold text-blue-900">
                                🇨🇳 中文“贵” → 🇰🇷 韩语
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">💰</span>

                                    <div>
                                        <div className="font-bold text-gray-950">
                                            价格贵 → 비싸다
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            这个东西很贵 → 이 물건은 비싸요.
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-blue-100" />

                                <div className="flex items-center gap-3">
                                    <span className="text-lg">💎</span>

                                    <div>
                                        <div className="font-bold text-gray-950">
                                            珍贵 / 宝贵 / 难得 → 귀하다
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            貴 → 귀
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Tip>
                            中文里的一个“贵”，根据意思不同，
                            在韩语里可能需要使用不同的词。
                            说“价格高”时一般使用“비싸다”，
                            表示“珍贵、宝贵、难得”时可以使用“귀하다”。
                        </Tip>
                    </div>
                </LessonSection>

                {/* 정리 */}
                <section className="mt-16 rounded-2xl bg-gray-50 p-6">
                    <div className="text-xs font-bold tracking-[0.18em] text-blue-600">
                        REVIEW
                    </div>

                    <h2 className="mt-2 text-xl font-bold text-gray-950">
                        今天最值得记住的汉字词
                    </h2>

                    <div className="mt-5 space-y-3">
                        <ReviewRow korean="고향" hanja="故鄕" chinese="故乡 / 家乡" />
                        <ReviewRow korean="지하철" hanja="地下鐵" chinese="地铁" />
                        <ReviewRow korean="장소" hanja="场所" chinese="场所 / 地点" />
                        <ReviewRow korean="생활" hanja="生活" chinese="生活" />
                    </div>

                    <p className="mt-5 text-sm leading-7 text-gray-600">
                        会中文的话，这些单词不需要从零开始记。
                        先理解汉字和意思，再把韩语发音连接起来就可以了。
                    </p>
                </section>

                {/* 완료 */}
                <section className="mt-16 border-t border-gray-100 pt-10 text-center">
                    <div className="text-4xl">🎉</div>

                    <h2 className="mt-4 text-2xl font-bold text-gray-950">
                        第2课 完成！
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        不需要一次记住15个单词。
                        <br />
                        先记住你觉得容易的词，再慢慢复习。
                    </p>

                    <button
                        type="button"
                        onClick={() => router.push("/korean/beginner")}
                        className="mt-7 rounded-xl bg-gray-950 px-7 py-3 text-sm font-bold text-white print:hidden"
                    >
                        ← 返回课程列表
                    </button>
                </section>
            </article>
        </main>
    );
}


/* =========================================================
   COMPONENTS
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

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "ko-KR";
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

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
            className="print:hidden inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
            🔊 {label}
        </button>
    );
}


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

            <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-950">
                    {title}
                </h2>

                {pronunciation && (
                    <PronunciationButton text={pronunciation} />
                )}
            </div>

            <div className="mt-1 text-sm text-gray-400">
                {meaning}
            </div>

            <div className="mt-6 space-y-4 text-[16px] leading-8 text-gray-700">
                {children}
            </div>
        </section>
    );
}


function Strong({ children }: { children: ReactNode }) {
    return (
        <span className="font-bold text-gray-950">
            {children}
        </span>
    );
}


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
            className={`flex items-center gap-3 px-4 py-4 ${last ? "" : "border-b border-gray-100"
                }`}
        >
            <div className="min-w-0 flex-1">
                <div className="font-bold text-gray-950">
                    {korean}
                </div>

                {hanja && (
                    <div className="text-xs text-gray-400">
                        {hanja}
                    </div>
                )}
            </div>

            <div className="text-right text-sm text-gray-500">
                {chinese}
            </div>

            <PronunciationButton text={korean} label="听" />
        </div>
    );
}


function Example({
    korean,
    chinese,
}: {
    korean: string;
    chinese: string;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="font-bold text-gray-950">
                        {korean}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
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


function Tip({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl bg-blue-50 p-5 text-[15px] leading-7 text-blue-900">
            💡 {children}
        </div>
    );
}


function HanjaBox({
    items,
    result,
}: {
    items: [string, string][];
    result: string;
}) {
    return (
        <div className="rounded-2xl bg-gray-50 p-6">
            <div className="space-y-3">
                {items.map(([hanja, korean]) => (
                    <div
                        key={hanja}
                        className="flex items-center justify-center text-xl"
                    >
                        <span className="w-16 text-right font-bold">
                            {hanja}
                        </span>

                        <span className="mx-5 text-gray-300">→</span>

                        <span className="w-16 font-bold text-blue-600">
                            {korean}
                        </span>

                        <div className="ml-2 print:hidden">
                            <PronunciationButton text={korean} label="听" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="text-center text-xl font-bold">
                {result}
            </div>
        </div>
    );
}


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
        <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
                <span className="font-bold">{from}</span>
                <span className="text-gray-300">→</span>
                <span className="font-bold text-blue-600">{to}</span>
                <span className="ml-auto text-xs text-gray-400">{note}</span>
            </div>

            <div className="mt-3 flex gap-2">
                <PronunciationButton text={from} label="基本形" />
                <PronunciationButton text={to} label="听变化" />
            </div>
        </div>
    );
}


function CompareList({
    items,
}: {
    items: [string, string][];
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
            {items.map(([korean, chinese], index) => (
                <div
                    key={korean}
                    className={`flex items-center gap-3 p-4 ${index !== items.length - 1
                        ? "border-b border-gray-100"
                        : ""
                        }`}
                >
                    <div className="flex-1">
                        <div className="font-bold text-gray-950">
                            {korean}
                        </div>

                        <div className="text-sm text-gray-500">
                            {chinese}
                        </div>
                    </div>

                    <PronunciationButton text={korean} label="听" />
                </div>
            ))}
        </div>
    );
}


function ReviewRow({
    korean,
    hanja,
    chinese,
}: {
    korean: string;
    hanja: string;
    chinese: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-white p-4">
            <div className="min-w-0 flex-1">
                <span className="font-bold text-gray-950">
                    {korean}
                </span>

                <span className="ml-2 text-sm text-gray-400">
                    {hanja}
                </span>
            </div>

            <span className="text-sm text-gray-500">
                {chinese}
            </span>

            <PronunciationButton text={korean} label="听" />
        </div>
    );
}