export default function Footer() {
  return (
    <footer className="bg-gray-900 py-10 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
        <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
        <div className="mt-4 flex gap-6">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
