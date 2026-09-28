"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function Lesson3Page() {
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
                        🌱 BEGINNER · 第3课
                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-gray-950">
                        单词 3
                    </h1>

                    <p className="mt-3 text-[15px] leading-7 text-gray-500">
                        这次继续学习生活中经常使用的韩语单词。
                        <br />
                        有些词还可以和你已经认识的中文汉字词联系起来学习。
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
                        <WordRow korean="들어가다" chinese="进去 / 进入" />
                        <WordRow korean="돈" chinese="钱" />
                        <WordRow korean="끝나다" chinese="结束" />
                        <WordRow korean="편지" chinese="信" />
                        <WordRow korean="바쁘다" chinese="忙" />
                        <WordRow korean="소개" hanja="绍介" chinese="介绍" />
                        <WordRow korean="근처" chinese="附近" />
                        <WordRow korean="취미" hanja="趣味" chinese="爱好" />
                        <WordRow korean="일찍" chinese="早 / 早点" />
                        <WordRow korean="아직" chinese="还 / 还没" />
                        <WordRow korean="사무실" hanja="事务室" chinese="办公室" />
                        <WordRow korean="계획" hanja="计划" chinese="计划" />
                        <WordRow korean="일어나다" chinese="起床 / 起来" />
                        <WordRow korean="우체국" chinese="邮局" />
                        <WordRow korean="노래" chinese="歌 / 歌曲" last />
                    </div>
                </section>

                {/* 01 들어가다 */}
                <LessonSection
                    number="01"
                    title="들어가다"
                    meaning="进去 · 进入"
                    pronunciation="들어가다"
                >
                    <p>
                        <Strong>들어가다</Strong> 表示从外面进入里面，
                        和中文的“进去、进入”比较接近。
                    </p>

                    <Example
                        korean="교실에 들어가요."
                        chinese="进入教室。"
                    />

                    <Example
                        korean="집에 들어가요."
                        chinese="回家 / 进家里。"
                    />

                    <CompareList
                        items={[
                            ["들어가다", "进去 / 进入"],
                            ["나오다", "出来"],
                        ]}
                    />

                    <Tip>
                        可以把“들어가다”和“나오다”一起记。
                        一个是进入，一个是出来。
                    </Tip>
                </LessonSection>

                {/* 02 돈 */}
                <LessonSection
                    number="02"
                    title="돈"
                    meaning="钱"
                    pronunciation="돈"
                >
                    <p>
                        <Strong>돈</Strong> 就是中文的“钱”，
                        是日常生活中非常常用的韩语固有词。
                    </p>

                    <Example
                        korean="돈이 있어요."
                        chinese="有钱。"
                    />

                    <Example
                        korean="돈이 없어요."
                        chinese="没钱。"
                    />

                    <Example
                        korean="돈을 벌어요."
                        chinese="赚钱。"
                    />

                    <Tip>
                        “돈을 벌다”是非常常用的表达，
                        可以一起记成“赚钱”。
                    </Tip>
                </LessonSection>

                {/* 03 끝나다 */}
                <LessonSection
                    number="03"
                    title="끝나다"
                    meaning="结束"
                    pronunciation="끝나다"
                >
                    <p>
                        <Strong>끝나다</Strong> 表示课程、工作、电影等
                        自己“结束”。
                    </p>

                    <Example
                        korean="수업이 끝났어요."
                        chinese="下课了 / 课程结束了。"
                    />

                    <Example
                        korean="일이 끝났어요."
                        chinese="工作结束了。"
                    />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 p-5">
                            <div className="text-sm font-bold text-gray-950">
                                끝나다
                            </div>

                            <div className="mt-2 text-lg font-bold text-blue-600">
                                自己结束
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                수업이 끝나다
                                <br />
                                课程结束
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-5">
                            <div className="text-sm font-bold text-gray-950">
                                끝내다
                            </div>

                            <div className="mt-2 text-lg font-bold text-blue-600">
                                把某件事做完
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                숙제를 끝내다
                                <br />
                                把作业做完
                            </p>
                        </div>
                    </div>

                    <Tip>
                        初级阶段先记住“끝나다 = 结束”就可以。
                        以后再慢慢区分“끝나다”和“끝내다”。
                    </Tip>
                </LessonSection>

                {/* 04 편지 */}
                <LessonSection
                    number="04"
                    title="편지"
                    meaning="信"
                    pronunciation="편지"
                >
                    <p>
                        <Strong>편지</Strong> 就是写给别人的“信”。
                    </p>

                    <Example
                        korean="편지를 써요."
                        chinese="写信。"
                    />

                    <Example
                        korean="친구에게 편지를 보냈어요."
                        chinese="给朋友寄了信。"
                    />

                    <Tip>
                        可以把“편지를 쓰다”一起记成“写信”，
                        比只记一个单词更容易实际使用。
                    </Tip>
                </LessonSection>

                {/* 05 바쁘다 */}
                <LessonSection
                    number="05"
                    title="바쁘다"
                    meaning="忙"
                    pronunciation="바쁘다"
                >
                    <p>
                        <Strong>바쁘다</Strong> 的意思是“忙”。
                    </p>

                    <p>
                        实际说话的时候，经常会听到
                        <Strong> 바빠요</Strong>。
                    </p>

                    <ChangeRow
                        from="바쁘다"
                        to="바빠요"
                        note="忙"
                    />

                    <Example
                        korean="오늘 바빠요."
                        chinese="今天很忙。"
                    />

                    <Example
                        korean="요즘 너무 바빠요."
                        chinese="最近太忙了。"
                    />

                    <Tip>
                        单词表里看到的是“바쁘다”，
                        但实际日常对话里更容易听到“바빠요”。
                    </Tip>
                </LessonSection>

                {/* 06 소개 */}
                <LessonSection
                    number="06"
                    title="소개（紹介）"
                    meaning="介绍"
                    pronunciation="소개"
                >
                    <p>
                        <Strong>소개</Strong> 的意思和中文的“介绍”很接近。
                    </p>

                    <p>
                        不过有意思的是，韩语和现代中文使用的汉字并不一样。
                    </p>

                    <HanjaBox
                        items={[
                            ["绍(紹)", "소"],
                            ["介", "개"],
                        ]}
                        result="绍介 → 소개"
                    />

                    <p>
                        现代中文一般说
                        <Strong>“介绍”</Strong>，
                        而韩语的“소개”来自
                        <Strong> 紹介</Strong>。
                    </p>

                    <Example
                        korean="자기소개를 해요."
                        chinese="做自我介绍。"
                    />

                    <Example
                        korean="친구를 소개해요."
                        chinese="介绍朋友。"
                    />

                    <Tip>
                        韩语和中文有很多意思相近的汉字词，
                        但是实际使用的汉字不一定完全相同。
                    </Tip>
                </LessonSection>

                {/* 07 근처 */}
                <LessonSection
                    number="07"
                    title="근처"
                    meaning="附近"
                    pronunciation="근처"
                >
                    <p>
                        <Strong>근처</Strong> 的意思是“附近”，
                        是日常韩语中非常常用的表达。
                    </p>

                    <Example
                        korean="학교 근처"
                        chinese="学校附近"
                    />

                    <Example
                        korean="집 근처"
                        chinese="家附近"
                    />

                    <Example
                        korean="학교 근처에 카페가 있어요."
                        chinese="学校附近有咖啡店。"
                    />

                    <Tip>
                        在日常对话中，“地点 + 근처”是非常常用的表达。
                        比如“학교 근처（学校附近）”、“집 근처（家附近）”。
                    </Tip>

                    {/* 부근 설명 */}
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-bold text-gray-950">
                            부근（附近）
                        </h3>

                        <div className="mt-3">
                            <PronunciationButton
                                text="부근"
                                label="听发音"
                            />
                        </div>

                        <p className="mt-5">
                            有意思的是，韩语里其实也有和中文
                            <Strong>“附近”</Strong>
                            使用完全相同汉字的词。
                        </p>

                        <HanjaBox
                            items={[
                                ["附", "부"],
                                ["近", "근"],
                            ]}
                            result="附近 → 부근"
                        />

                        <p>
                            中文的“附近”按照韩语汉字音读作
                            <Strong> 부근</Strong>。
                        </p>

                        <p>
                            <Strong>근처</Strong> 和
                            <Strong> 부근</Strong>
                            都可以表示“附近”，
                            但是使用的场合有一点不同。
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    💬 日常会话
                                </div>

                                <div className="mt-2 text-lg font-bold text-blue-600">
                                    근처
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    和朋友聊天、问路等日常场合非常常用。
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    📰 书面、位置说明
                                </div>

                                <div className="mt-2 text-lg font-bold text-blue-600">
                                    부근
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    在新闻、交通信息、位置说明等表达中经常可以看到。
                                </p>
                            </div>
                        </div>

                        <Example
                            korean="서울역 부근"
                            chinese="首尔站附近"
                        />

                        <Example
                            korean="사고 현장 부근"
                            chinese="事故现场附近"
                        />

                        <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                            <div className="text-sm font-bold text-blue-900">
                                🇨🇳 中文“附近” → 🇰🇷 韩语
                            </div>

                            <div className="mt-4 space-y-3">
                                <div>
                                    <div className="font-bold text-gray-950">
                                        💬 日常说“附近”
                                    </div>

                                    <div className="mt-1 text-sm text-gray-600">
                                        → 근처
                                    </div>
                                </div>

                                <div className="border-t border-blue-100" />

                                <div>
                                    <div className="font-bold text-gray-950">
                                        📖 附近的韩语汉字音
                                    </div>

                                    <div className="mt-1 text-sm text-gray-600">
                                        附近 → 부근
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Tip>
                            中文的“附近”这个汉字词在韩语里也存在，
                            读作“부근”。不过普通日常对话中，
                            “근처”更加常用。
                        </Tip>
                    </div>
                </LessonSection>

                {/* 08 취미 */}
                <LessonSection
                    number="08"
                    title="취미（趣味）"
                    meaning="爱好 · hobby"
                    pronunciation="취미"
                >
                    <p>
                        <Strong>취미</Strong> 的意思是“爱好、hobby”。
                    </p>

                    <p>
                        “취미”其实也是一个汉字词。
                    </p>

                    <HanjaBox
                        items={[
                            ["趣", "취"],
                            ["味", "미"],
                        ]}
                        result="趣味 → 취미"
                    />

                    <Example
                        korean="취미가 뭐예요?"
                        chinese="你的爱好是什么？"
                    />

                    <Example
                        korean="제 취미는 여행이에요."
                        chinese="我的爱好是旅行。"
                    />

                    <Tip>
                        要注意，现代韩语的“취미（趣味）”
                        一般表示中文的“爱好、hobby”。
                    </Tip>

                    {/* 애호 설명 */}
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-bold text-gray-950">
                            애호（爱好）
                        </h3>

                        <div className="mt-3">
                            <PronunciationButton
                                text="애호"
                                label="听发音"
                            />
                        </div>

                        <p className="mt-5">
                            有意思的是，韩语里其实也有和中文
                            <Strong>“爱好”</Strong>
                            使用相同汉字的词。
                        </p>

                        <HanjaBox
                            items={[
                                ["爱(愛)", "애"],
                                ["好", "호"],
                            ]}
                            result="爱好 → 애호"
                        />

                        <p>
                            中文的“爱好（愛好）”按照韩语汉字音读作
                            <Strong> 애호</Strong>。
                        </p>

                        <p>
                            但是，在日常韩语中表达自己的“hobby”时，
                            一般不会说“애호”，而是使用
                            <Strong> 취미</Strong>。
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    💬 日常表达
                                </div>

                                <div className="mt-2 text-lg font-bold text-blue-600">
                                    취미（趣味）
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    表示一个人的爱好、hobby。
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5">
                                <div className="text-sm font-bold text-gray-950">
                                    📖 汉字词
                                </div>

                                <div className="mt-2 text-lg font-bold text-blue-600">
                                    애호（爱好）
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    表示喜欢、喜爱某种事物。
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                            <div className="text-sm font-bold text-blue-900">
                                💡 애호가（爱好家）
                            </div>

                            <div className="mt-3 text-lg font-bold text-gray-950">
                                爱好家 → 애호가
                            </div>

                            <div className="mt-3">
                                <PronunciationButton
                                    text="애호가"
                                    label="听发音"
                                />
                            </div>

                            <p className="mt-3 text-sm leading-7 text-gray-700">
                                “애호가”和中文的“爱好者”比较接近。
                            </p>
                        </div>

                        <Example
                            korean="음악 애호가"
                            chinese="音乐爱好者"
                        />

                        <Example
                            korean="독서 애호가"
                            chinese="阅读爱好者"
                        />

                        <Tip>
                            可以记成：日常说自己的“爱好”时使用“취미”，
                            而“愛好”这个汉字词在韩语里读作“애호”。
                        </Tip>
                    </div>
                </LessonSection>

                {/* 09 일찍 */}
                <LessonSection
                    number="09"
                    title="일찍"
                    meaning="早 · 早点"
                    pronunciation="일찍"
                >
                    <p>
                        <Strong>일찍</Strong> 表示比平常或者预定时间更早。
                    </p>

                    <Example
                        korean="오늘 일찍 일어났어요."
                        chinese="今天起得很早。"
                    />

                    <Example
                        korean="일찍 자요."
                        chinese="早点睡。"
                    />

                    <CompareList
                        items={[
                            ["일찍", "早 / 早点"],
                            ["늦게", "晚 / 晚一点"],
                        ]}
                    />

                    <Tip>
                        可以把“일찍 ↔ 늦게”一起记，
                        就像中文的“早 ↔ 晚”。
                    </Tip>
                </LessonSection>

                {/* 10 아직 */}
                <LessonSection
                    number="10"
                    title="아직"
                    meaning="还 · 还没"
                    pronunciation="아직"
                >
                    <p>
                        <Strong>아직</Strong> 表示某种状态持续到现在，
                        和中文的“还、还没”很接近。
                    </p>

                    <div className="rounded-2xl bg-blue-50 p-5 text-center">
                        <span className="font-bold text-blue-900">
                            아직 + 否定表达 ≈ 还没……
                        </span>
                    </div>

                    <Example
                        korean="아직 안 먹었어요."
                        chinese="还没吃。"
                    />

                    <Example
                        korean="아직 몰라요."
                        chinese="还不知道。"
                    />

                    <Example
                        korean="아직 안 끝났어요."
                        chinese="还没结束。"
                    />

                    <p>
                        不过，“아직”并不一定只能和否定句一起使用。
                    </p>

                    <Example
                        korean="아직 학생이에요."
                        chinese="还是学生。"
                    />

                    <Tip>
                        不要只把“아직”记成“还没”。
                        可以先理解成“到现在还……”的感觉。
                    </Tip>
                </LessonSection>

                {/* 11 사무실 */}
                <LessonSection
                    number="11"
                    title="사무실（事务室）"
                    meaning="办公室"
                    pronunciation="사무실"
                >
                    <p>
                        <Strong>사무실</Strong> 的意思是“办公室”。
                    </p>

                    <p>
                        这个词也是汉字词，
                        但是现代中文一般使用“办公室”。
                    </p>

                    <HanjaBox
                        items={[
                            ["事", "사"],
                            ["务(務)", "무"],
                            ["室", "실"],
                        ]}
                        result="事务室 → 사무실"
                    />

                    <div className="rounded-xl bg-gray-50 p-5">
                        <div className="font-bold text-gray-950">
                            🇰🇷 事务室 → 사무실
                        </div>

                        <div className="mt-2 font-bold text-gray-950">
                            🇨🇳 办公室
                        </div>
                    </div>

                    <Example
                        korean="사무실에 있어요."
                        chinese="在办公室。"
                    />

                    <Tip>
                        韩语和中文表达的是同一个地方，
                        但是现代常用的汉字词不一样。
                    </Tip>
                </LessonSection>

                {/* 12 계획 */}
                <LessonSection
                    number="12"
                    title="계획（计划）"
                    meaning="计划"
                    pronunciation="계획"
                >
                    <p>
                        <Strong>계획</Strong> 是一个非常适合用中文来记的韩语单词。
                    </p>

                    <HanjaBox
                        items={[
                            ["计(計)", "계"],
                            ["划(劃)", "획"],
                        ]}
                        result="计划 → 계획"
                    />

                    <Example
                        korean="여행 계획이 있어요."
                        chinese="有旅行计划。"
                    />

                    <Example
                        korean="계획을 세워요."
                        chinese="制定计划。"
                    />

                    <Tip>
                        这个词不需要从零开始学习意思。
                        你已经知道中文“计划”，
                        只需要把它和韩语发音“계획”连接起来。
                    </Tip>
                </LessonSection>

                {/* 13 일어나다 */}
                <LessonSection
                    number="13"
                    title="일어나다"
                    meaning="起床 · 起来"
                    pronunciation="일어나다"
                >
                    <p>
                        初级阶段可以先把
                        <Strong> 일어나다</Strong>
                        理解成“起床、起来”。
                    </p>

                    <Example
                        korean="아침 7시에 일어나요."
                        chinese="早上七点起床。"
                    />

                    <Example
                        korean="저는 매일 일찍 일어나요."
                        chinese="我每天很早起床。"
                    />

                    <p>
                        “일어나다”还有“发生”的意思。
                    </p>

                    <Example
                        korean="무슨 일이 일어났어요?"
                        chinese="发生什么事了？"
                    />

                    <Tip>
                        一个单词可能有多个意思。
                        现在先记住最常用的“起床、起来”就可以。
                    </Tip>
                </LessonSection>

                {/* 14 우체국 */}
                <LessonSection
                    number="14"
                    title="우체국"
                    meaning="邮局"
                    pronunciation="우체국"
                >
                    <p>
                        <Strong>우체국</Strong> 就是中文的“邮局”。
                    </p>

                    <Example
                        korean="우체국에 가요."
                        chinese="去邮局。"
                    />

                    <Example
                        korean="우체국이 어디예요?"
                        chinese="邮局在哪里？"
                    />

                    <p>
                        还可以和今天学习的
                        <Strong> 근처</Strong>
                        一起使用。
                    </p>

                    <Example
                        korean="근처에 우체국이 있어요?"
                        chinese="附近有邮局吗？"
                    />

                    <Tip>
                        学新单词的时候，
                        把它和已经学过的单词组合起来会更容易记住。
                    </Tip>
                </LessonSection>

                {/* 15 노래 */}
                <LessonSection
                    number="15"
                    title="노래"
                    meaning="歌 · 歌曲"
                    pronunciation="노래"
                >
                    <p>
                        <Strong>노래</Strong> 的意思是“歌、歌曲”，
                        是韩语固有词。
                    </p>

                    <Example
                        korean="노래를 들어요."
                        chinese="听歌。"
                    />

                    <Example
                        korean="노래를 불러요."
                        chinese="唱歌。"
                    />

                    <CompareList
                        items={[
                            ["노래를 듣다", "听歌"],
                            ["노래를 부르다", "唱歌"],
                        ]}
                    />

                    <Tip>
                        表达“唱歌”时，
                        “노래를 부르다”是非常常用的表达。
                    </Tip>
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
                        <ReviewRow
                            korean="부근"
                            hanja=""
                            chinese="附近"
                        />

                        <ReviewRow
                            korean="취미"
                            hanja="趣味"
                            chinese="爱好"
                        />

                        <ReviewRow
                            korean="사무실"
                            hanja="事务室"
                            chinese="办公室"
                        />

                        <ReviewRow
                            korean="계획"
                            hanja=""
                            chinese="计划"
                        />
                    </div>

                    <p className="mt-5 text-sm leading-7 text-gray-600">
                        有些中文词在韩语里也存在相同的汉字词，
                        但日常最常用的表达可能不一样。
                        先利用你已经认识的汉字理解意思，
                        再记住韩国人实际常用的表达。
                    </p>
                </section>

                {/* 완료 */}
                <section className="mt-16 border-t border-gray-100 pt-10 text-center">
                    <div className="text-4xl">🎉</div>

                    <h2 className="mt-4 text-2xl font-bold text-gray-950">
                        第3课 完成！
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
            className={`flex items-center gap-3 px-4 py-4 ${
                last ? "" : "border-b border-gray-100"
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

                        <span className="mx-5 text-gray-300">
                            →
                        </span>

                        <span className="w-16 font-bold text-blue-600">
                            {korean}
                        </span>

                        <div className="ml-2 print:hidden">
                            <PronunciationButton
                                text={korean}
                                label="听"
                            />
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
                <span className="font-bold">
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

            <div className="mt-3 flex gap-2">
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
                    className={`flex items-center gap-3 p-4 ${
                        index !== items.length - 1
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

                    <PronunciationButton
                        text={korean}
                        label="听"
                    />
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

            <PronunciationButton
                text={korean}
                label="听"
            />
        </div>
    );
}