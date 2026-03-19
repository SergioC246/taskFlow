import { auth, signOut } from '@/auth';
import { getTasks, createTask, deleteTask, updateTaskStatus } from '@/lib/actions';
import { Task } from '@prisma/client';

const priorityStyles: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const priorityLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  const { filter } = await searchParams;
  const tasks = await getTasks();

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <main className="p-8 max-w-3xl mx-auto">
      {/* Header */}
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
          const priority = formData.get('priority') as string;
          const dueDate = formData.get('dueDate') as string;
          if (title.trim()) await createTask(title, priority, dueDate);
        }}
        className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3"
      >
        <input
          type="text"
          name="title"
          placeholder="Nueva tarea..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-3">
          <select
            name="priority"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Prioridad baja</option>
            <option value="medium">Prioridad media</option>
            <option value="high">Prioridad alta</option>
          </select>
          <input
            type="date"
            name="dueDate"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Añadir
          </button>
        </div>
      </form>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {[
          { label: 'Todas', value: '' },
          { label: 'Pendientes', value: 'pending' },
          { label: 'Completadas', value: 'completed' },
        ].map(({ label, value }) => (
          <a
            key={value}
            href={value ? `?filter=${value}` : '/tasks'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (filter ?? '') === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Lista de tareas */}
      <div className="space-y-3">
        {filteredTasks.length === 0 && (
          <p className="text-gray-400 text-center py-8">No hay tareas aquí.</p>
        )}
        {filteredTasks.map((task: Task) => {
          const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== 'completed';

          return (
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

              <div className="flex-1 min-w-0">
                <span
                  className={`block ${
                    task.status === 'completed'
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </span>
                {task.dueDate && (
                  <span
                    className={`text-xs ${
                      isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {isOverdue ? '⚠ Vencida: ' : 'Fecha límite: '}
                    {new Date(task.dueDate).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  priorityStyles[task.priority]
                }`}
              >
                {priorityLabels[task.priority]}
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
          );
        })}
      </div>
    </main>
  );
}