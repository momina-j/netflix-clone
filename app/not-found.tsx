import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-red-600 font-black text-9xl mb-4">404</h1>
      <h2 className="text-white text-3xl font-bold mb-4">Lost your way?</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link
        href="/"
        className="bg-white text-black font-bold px-8 py-3 rounded hover:bg-white/80 transition-colors"
      >
        Netflix Clone Home
      </Link>
    </div>
  );
}
