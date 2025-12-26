import Link from 'next/link';
import Header from "./components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <img
            src="/lost.webp"
            alt="Lost in the wilderness"
            className="w-48 h-48 mx-auto mb-8 opacity-80"
          />
          <h1 className="text-6xl font-bold text-gray-800 mb-4">Oopsie!</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            You&apos;ve wandered off route.
          </h2>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Return to Base Camp
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
