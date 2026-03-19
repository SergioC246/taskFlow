import { auth, signOut } from '@/auth';

export default async function TasksPage() {
  const session = await auth();

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis tareas</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hola, {session?.user?.name}</span>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
      <p className="text-gray-500">Las tareas aparecerán aquí en la Fase 3.</p>
    </main>
  );
}