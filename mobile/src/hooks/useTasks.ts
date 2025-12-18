import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, fetchStats } from '../api/tasks';
import { TaskDTO, Priority, TaskFilterDTO } from '@shared/index';

export const useTasks = (filter?: TaskFilterDTO) => {
    const queryClient = useQueryClient();

    const tasksQuery = useQuery({
        queryKey: ['tasks', filter],
        queryFn: () => fetchTasks(filter),
    });

    const statsQuery = useQuery({
        queryKey: ['stats', tasksQuery.data], // Refetch stats when tasks change
        queryFn: () => fetchStats(),
        enabled: true,
    });

    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onMutate: async (newTask) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData<TaskDTO[]>(['tasks']);

            // Optimistically update to the new value
            queryClient.setQueryData<TaskDTO[]>(['tasks'], (old) => {
                const optimisticTask: TaskDTO = {
                    id: Math.random().toString(), // Temp ID
                    title: newTask.title,
                    description: newTask.description || '',
                    completed: false, // Default
                    priority: newTask.priority || Priority.MEDIUM,
                    userId: 'temp-user',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                return old ? [optimisticTask, ...old] : [optimisticTask];
            });

            // Return a context object with the snapshotted value
            return { previousTasks };
        },
        onError: (err, newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(['tasks'], context?.previousTasks);
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const toggleTaskMutation = useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            updateTask(id, { completed }),
        onMutate: async ({ id, completed }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueryData<TaskDTO[]>(['tasks']);

            queryClient.setQueryData<TaskDTO[]>(['tasks'], (old) => {
                if (!old) return [];
                return old.map((task) =>
                    task.id === id ? { ...task, completed } : task
                );
            });

            return { previousTasks };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['tasks'], context?.previousTasks);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    return {
        tasks: tasksQuery.data,
        stats: statsQuery.data,
        isLoading: tasksQuery.isLoading || statsQuery.isLoading,
        isError: tasksQuery.isError,
        createTask: createTaskMutation.mutate,
        toggleTask: toggleTaskMutation.mutate,
    };
};
