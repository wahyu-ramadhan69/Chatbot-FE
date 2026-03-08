"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* layer background gradient + motif */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#071A2D_0%,#0B2136_60%,#0F2A44_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-15 bg-[url('/window.svg')] bg-repeat bg-[length:520px]" />

      {/* content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 lg:pt-16 pb-28 flex flex-col lg:flex-row items-center justify-between">
        {/* kiri: teks */}
        <div className="lg:w-[52%] text-white">
          <p className="uppercase tracking-[.2em] text-sm text-gray-300 mb-4">
            Selamat Datang di
          </p>

          <h1 className="font-extrabold leading-[1.05] tracking-tight text-4xl md:text-5xl xl:text-[56px]">
            MAL PELAYANAN PUBLIK <br />
            HARAPAN DAN DO&apos;A KOTA <br />
            BENGKULU
          </h1>

          <div className="mt-8 flex gap-4">
            <a className="bg-[#2E6BBA] hover:bg-[#255a9a] text-white font-semibold px-5 py-2.5 rounded-md text-sm">
              Daftar Antrian
            </a>
            <a className="bg-[#BF1E2E] hover:bg-[#a11927] text-white font-semibold px-5 py-2.5 rounded-md text-sm">
              Pengaduan
            </a>
          </div>
        </div>

        {/* kanan: foto wali kota */}
        <div className="lg:w-[48%] mt-12 lg:mt-0 flex justify-center">
          <Image
            src="/images/fotowalikota.png"
            alt="Wali Kota Bengkulu"
            width={600}
            height={600}
            className="object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
            priority
          />
        </div>
      </div>

      {/* wave separator ke section putih */}
      <div className="relative -mt-6 lg:-mt-8">
        <svg viewBox="0 0 1440 120" className="w-full h-[80px] lg:h-[120px] block">
          <path
            d="M0,64 C240,120 480,0 720,48 C960,96 1200,64 1440,16 L1440,120 L0,120 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
