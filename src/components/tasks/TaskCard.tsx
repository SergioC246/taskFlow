'use client';

import { useState } from 'react';
import { updateTask, updateTaskStatus, deleteTask } from '@/lib/actions';
import { Task } from '@prisma/client';

const priorityConfig: Record<string, { label: string; icon: string; styles: string }> = {
  low: {
    label: 'Baja',
    icon: '🟢',
    styles: 'bg-green-50 text-green-700 border border-green-200',
  },
  medium: {
    label: 'Media',
    icon: '🟡',
    styles: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  },
  high: {
    label: 'Alta',
    icon: '🔴',
    styles: 'bg-red-50 text-red-700 border border-red-200',
  },
};

export default function TaskCard({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const handleSave = async () => {
    await updateTask(task.id, {
      title,
      priority,
      dueDate: dueDate || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const config = priorityConfig[task.priority] ?? priorityConfig.medium;

  return (
    <div
      className={`bg-white border rounded-xl px-4 py-4 transition-all duration-200 hover:shadow-md ${
        task.status === 'completed' ? 'border-gray-100 opacity-60' : 'border-gray-200'
      }`}
    >
      {isEditing ? (
        /* Modo edición */
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        /* Modo visualización */
        <div className="flex items-center gap-3">
          {/* Botón completar */}
          <button
            onClick={async () => {
              await updateTaskStatus(
                task.id,
                task.status === 'completed' ? 'pending' : 'completed'
              );
            }}
            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-400'
            }`}
          />

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <span
              className={`block font-medium ${
                task.status === 'completed'
                  ? 'line-through text-gray-400'
                  : 'text-gray-800'
              }`}
            >
              {task.title}
            </span>
            {task.dueDate && (
              <span
                className={`text-xs mt-0.5 flex items-center gap-1 ${
                  isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'
                }`}
              >
                {isOverdue ? '⚠️' : '📅'}
                {isOverdue ? 'Vencida: ' : ''}
                {new Date(task.dueDate).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>

          {/* Badge prioridad */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${config.styles}`}
          >
            {config.icon} {config.label}
          </span>

          {/* Botón editar */}
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded"
            title="Editar tarea"
          >
            ✏️
          </button>

          {/* Botón eliminar */}
          <button
            onClick={async () => {
              await deleteTask(task.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
            title="Eliminar tarea"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}