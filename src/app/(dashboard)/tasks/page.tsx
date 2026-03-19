import { auth, signOut } from '@/auth';
import { getTasks, createTask, deleteTask, updateTaskStatus } from '@/lib/actions';

export default async function TasksPage() {
  const session = await auth();
  const tasks = await getTasks();

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
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

      {/* Formulario crear tarea */}
      <form
        action={async (formData: FormData) => {
          'use server';
          const title = formData.get('title') as string;
          if (title.trim()) await createTask(title);
        }}
        className="flex gap-2 mb-8"
      >
        <input
          type="text"
          name="title"
          placeholder="Nueva tarea..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Añadir
        </button>
      </form>

      {/* Lista de tareas */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-gray-400 text-center py-8">No tienes tareas todavía. ¡Crea una!</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
          >
            <form
              action={async () => {
                'use server';
                await updateTaskStatus(
                  task.id,
                  task.status === 'completed' ? 'pending' : 'completed'
                );
              }}
            >
              <button
                type="submit"
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                  task.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
              />
            </form>
            <span
              className={`flex-1 ${
                task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {task.title}
            </span>
            <form
              action={async () => {
                'use server';
                await deleteTask(task.id);
              }}
            >
              <button
                type="submit"
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}