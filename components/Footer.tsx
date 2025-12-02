import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            <p className="mb-1">
              Monohiroi - 非公式ファンサイト
            </p>
            <p className="text-xs">
              © {currentYear} Monohiroi. このサイトは個人が運営する非公式のWebサービスです。
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link 
              href="/about" 
              className="text-gray-400 hover:text-white transition"
            >
              免責事項・著作権
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}