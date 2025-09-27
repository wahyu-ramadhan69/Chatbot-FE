"use client"; // untuk Next.js App Router bila butuh interaktivitas

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">MyApp</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600">
              Home
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-indigo-600">
              Tentang
            </a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600">
              Antrian
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600">
              Testimoni
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600">
              Fasilitas
            </a>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-500"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-6 pt-4 pb-6 space-y-4">
            <a
              href="#features"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block text-gray-700 hover:text-indigo-600"
            >
              About
            </a>
            <a
              href="#contact"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Contact
            </a>
            <a
              href="#"
              className="block rounded-md bg-indigo-600 px-4 py-2 text-center text-white shadow hover:bg-indigo-500"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
