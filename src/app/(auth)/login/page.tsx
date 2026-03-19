export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
        <p className="text-gray-500 mb-6">Accede a tu cuenta para continuar</p>
        {/* NextAuth buttons — Fase 2 */}
        <div className="text-center text-gray-400 text-sm">
          Autenticación disponible en Fase 2
        </div>
      </div>
    </main>
  );
}