'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.email) throw new Error('No autorizado');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return [];

  return prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTask(title: string, priority: string = 'medium', dueDate?: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('No autorizado');

  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name ?? '',
        image: session.user.image ?? '',
      },
    });
  }

  await prisma.task.create({
    data: {
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: user.id,
    },
  });

  revalidatePath('/tasks');
}

export async function updateTaskStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('No autorizado');

  await prisma.task.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/tasks');
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('No autorizado');

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath('/tasks');
}

export async function updateTask(
  id: string,
  data: { title?: string; priority?: string; dueDate?: string | null }
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('No autorizado');

  await prisma.task.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
  });

  revalidatePath('/tasks');
}