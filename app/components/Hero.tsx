export default function Hero() {
  return (
    <section className="bg-gray-50 ">
      <div className="mx-auto max-w-6xl flex items-center justify-between w-full py-20">
        {/* Text */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Mall pelayanan publik kota bengkulu
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Di sini kamu dapat menemukan berbagai layanan publik yang ada di
            kota bengkulu, banyak hal yang bisa kamu lakukan di sini.
          </p>
          <div className="mt-8 flex gap-x-4">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-5 py-3 text-white shadow hover:bg-indigo-500"
            >
              Ayo mulai
            </a>
            <a
              href="#features"
              className="rounded-md border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100"
            >
              Tentang MPP
            </a>
          </div>
        </div>

        <div className="shrink-0">
          <img
            src="/Kota_Bengkulu.png"
            alt="Bengkulu"
            className="h-64 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
