import {ResponseDataType} from "types/types";
import {instance} from "../../TodolistsList/Todolist/todokists.api.ts/todokists.api";

// api
export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseDataType<{ userId?: number }>>('auth/login', data);
    },
    logout() {
        return instance.delete<ResponseDataType<{ userId?: number }>>('auth/login');
    },
    me() {
        return instance.get<ResponseDataType<{ id: number; email: string; login: string }>>('auth/me');
    }
}

//types
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
