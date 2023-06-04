import axios, {AxiosResponse} from 'axios'
import {FilterValuesType, ResponseDataType} from "types/types";
import {RequestStatus} from "enums/enums";


export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41'
    }
})

// api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string): Promise<AxiosResponse<ResponseDataType<{ item: TodolistType }>>> {
        return instance.post<ResponseDataType<{ item: TodolistType }>>('todo-lists', {title: title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseDataType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseDataType>(`todo-lists/${id}`, {title: title});
    },

}

//types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatus
}
