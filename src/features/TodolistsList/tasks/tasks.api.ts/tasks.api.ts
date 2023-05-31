import {instance} from "../../Todolist/todokists.api.ts/todokists.api";
import {TaskPriorities, TaskStatuses} from "enums/enums";
import {ResponseDataType} from "types/types";

// api
export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, taskTitile: string) {
        return instance.post<ResponseDataType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: taskTitile});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateDomainTaskModelType) {
        return instance.put<ResponseDataType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
}

//types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type UpdateTaskType = {
    taskId: string
    model: UpdateDomainTaskModelType
    todolistId: string
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}