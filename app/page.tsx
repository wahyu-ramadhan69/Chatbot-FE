import Image from "next/image";
import Hero from "./components/Hero";
import ChatWidget from "./components/ChatWidget"; // 
export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      {}
      <section className="bg-white text-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-2 gap-10 items-start">
          {}
          <div>
            <p className="uppercase tracking-wide text-[#5A86B8] font-semibold">
              MAL PELAYANAN PUBLIK
            </p>
            <h2 className="text-5xl font-extrabold text-[#316A9F] leading-tight mt-2">
              HARAPAN DAN <br /> DO&apos;A
            </h2>

            <div className="mt-8">
              <Image
                src="/images/mppkotabkl.png"
                alt="Logo MPP Kota Bengkulu"
                width={340}
                height={340}
                className="object-contain mx-auto md:mx-0"
              />
            </div>
          </div>

          {}
          <div className="text-justify leading-8 text-[15px] text-gray-700">
            Definisi Mal Pelayanan Publik menurut Peraturan Menteri PANRB Nomor 23 Tahun 2017
            adalah tempat berlangsungnya kegiatan atau aktivitas penyelenggaraan pelayanan publik
            atas barang, jasa dan/atau pelayanan administrasi yang merupakan perluasan fungsi
            pelayanan terpadu baik pusat maupun daerah serta pelayanan BUMN/BUMD dan Swasta
            dalam rangka menyediakan pelayanan yang cepat, mudah, terjangkau, aman dan nyaman.
            <div className="mt-8">
              <a className="inline-block border border-[#2E6BBA] text-[#2E6BBA] hover:bg-[#2E6BBA] hover:text-white rounded-md px-5 py-2 text-sm font-semibold transition-colors">
                Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </section>

      {}
      <ChatWidget />
    </main>
  );
}
