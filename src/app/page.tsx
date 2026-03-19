import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Task<span className="text-blue-600">Flow</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Organiza tu trabajo, alcanza tus objetivos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Empezar gratis
          </Link>
          <Link
            href="#features"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Saber más
          </Link>
        </div>
      </div>
    </main>
  );
}