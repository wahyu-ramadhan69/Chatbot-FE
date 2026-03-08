import "./globals.css";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white text-white">
        <div className="bg-[linear-gradient(180deg,#071A2D_0%,#0B2136_60%,#0F2A44_100%)]">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
