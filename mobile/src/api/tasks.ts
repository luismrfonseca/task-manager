import api from './client';
import { TaskDTO, CreateTaskDTO, TaskFilterDTO, TaskStatsDTO } from '@shared/index';

export const fetchTasks = async (filter?: TaskFilterDTO): Promise<TaskDTO[]> => {
    const response = await api.get('/tasks', { params: filter });
    return response.data;
};

export const fetchStats = async (): Promise<TaskStatsDTO> => {
    const response = await api.get('/tasks/stats');
    return response.data;
};

export const createTask = async (data: CreateTaskDTO): Promise<TaskDTO> => {
    const response = await api.post('/tasks', data);
    return response.data;
};

export const updateTask = async (id: string, data: Partial<TaskDTO>): Promise<TaskDTO> => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
};
