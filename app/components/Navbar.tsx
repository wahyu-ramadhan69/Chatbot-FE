"use client";
import Image from "next/image";

const NavLink = ({ label, active=false }: {label:string; active?:boolean}) => (
  <a
    href="#"
    className={[
      "px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "text-white bg-[#2E6BBA] rounded-full shadow-sm"
        : "text-gray-200 hover:text-white"
    ].join(" ")}
  >
    {label}
  </a>
);

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40">
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* logo kiri */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logompp3.png"
            alt="Logo MPP"
            width={170}
            height={48}
            className="object-contain"
            priority
          />
        </div>

        {/* menu */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink label="Home" active />
          <NavLink label="Tentang" />
          <NavLink label="Antrian" />
          <NavLink label="Instansi" />
          <NavLink label="Testimoni" />
          <NavLink label="Fasilitas" />
          <NavLink label="SIKEMON" />
          <NavLink label="Daftar Tamu" />
          <NavLink label="PENGADUAN" />
          <a className="ml-3 bg-[#BF1E2E] hover:bg-[#a11927] text-white text-sm font-semibold px-4 py-2 rounded-md">
            MPP Digital
          </a>
          <a className="bg-[#F2BE2D] hover:bg-[#e0ad1f] text-black text-sm font-semibold px-4 py-2 rounded-md">
            SIIKOLU
          </a>
        </div>
      </nav>
    </header>
  );
}
