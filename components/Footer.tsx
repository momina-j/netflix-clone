import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-16 py-12 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-500 text-sm mb-6">Questions? Contact us.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            ['FAQ', 'Investor Relations', 'Privacy', 'Speed Test'],
            ['Help Center', 'Jobs', 'Cookie Preferences', ''],
            ['Account', 'Ways to Watch', 'Corporate Information', ''],
            ['Media Center', 'Terms of Use', 'Contact Us', ''],
          ].map((col, i) => (
            <ul key={i} className="space-y-2">
              {col.filter(Boolean).map((item) => (
                <li key={item}>
                  <span className="text-gray-500 text-xs hover:underline cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Netflix Clone. Built with Next.js & TMDB API.
          </p>
          <p className="text-gray-700 text-xs">
            This app uses the TMDB API but is not endorsed by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
