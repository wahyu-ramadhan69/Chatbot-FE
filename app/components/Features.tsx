import { Cloud, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    name: "Samsat",
    description:
      "Layanan administrasi untuk kendaraan bermotor, pajak, dan lainnya.",
    icon: Zap,
  },
  {
    name: "Dukcapil",
    description:
      "Layanan administrasi kependudukan seperti KTP, KK, Akta Kelahiran, dan lainnya.",
    icon: ShieldCheck,
  },
  {
    name: "BPJS Kesehatan",
    description: "Layanan pendaftaran dan informasi terkait BPJS Kesehatan.",
    icon: Cloud,
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-indigo-600">
            MAL PELAYANAN PUBLIK
          </h2>
          <p className="mt-2 text-sm font-bold tracking-tight text-gray-900 ">
            HARAPAN DAN DO'A
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Definisi Mal Pelayanan Publik menurut Peraturan Menteri
            Pendayagunaan Aparatur Negara dan Reformasi Birokarasi Nomor 23
            Tahun 2017 adalah tempat berlangsungnya kegiatan atau aktivitas
            penyelenggaraan pelayanan publik atas barang, jasa dan/atau
            pelayanan administrasi yang merupakan perluasan fungsi pelayanan
            terpadu baik pusat maupun daerah serta pelayanan Badan Usaha Milik
            Negara /Badan usaha Milik Daerah dan Swasta dalam rangka menyediakan
            pelayanan yang cepat, mudah, terjangkau, aman dan nyaman.
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
