export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          한국 상품을 쉽게 구매하세요 🇰🇷
        </h1>

        <p className="mt-4 text-gray-600 text-center">
          구매하고 싶은 한국 상품의 링크를 입력해주세요.
        </p >

        <div className="mt-10 flex gap-3">
          <input
            type="url"
            placeholder="https://..."
            className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-4 text-gray-900 outline-none"
          />

          <button className="rounded-xl bg-black px-6 py-4 font-semibold text-white">
            상품 가져오기
          </button>
        </div>
      </div>
    </main>
  );
}