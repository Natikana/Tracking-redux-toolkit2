import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {RequestStatusType, setAppStatusAC} from 'app/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {AppThunk} from "app/store";


const todoInitialState: Array<TodolistDomainType> = []

export const slice = createSlice({
    name: 'todolists',
    initialState: todoInitialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const indexTodo = state.findIndex(el => el.id === action.payload.id)
            if (indexTodo !== -1)
                state.splice(indexTodo, 1)
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({
                ...action.payload.todolist,
                filter: FilterValuesType.all,
                entityStatus: RequestStatusType.idle
            })
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const indexTodo = state.findIndex(el => el.id === action.payload.id)
            if (indexTodo !== -1) {
                state[indexTodo].title = action.payload.title
            }
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const indexTodo = state.findIndex(el => el.id === action.payload.id)
            if (indexTodo !== -1) {
                state[indexTodo].filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const indexTodo = state.findIndex(el => el.id === action.payload.id)
            if (indexTodo !== -1) {
                state[indexTodo].entityStatus = action.payload.entityStatus
            }
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(el => ({
                ...el,
                entityStatus: RequestStatusType.idle,
                filter: FilterValuesType.all
            }))
        }
    },
    extraReducers(builder) {
        builder.addCase(commonActions, () => {
            return []
        })
    }
})
export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    setTodolistsAC,
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: RequestStatusType.loading}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists: res.data}))
                dispatch(setAppStatusAC({status: RequestStatusType.loading}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: RequestStatusType.loading}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: RequestStatusType.loading}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC({id: todolistId}))
                dispatch(setAppStatusAC({status: RequestStatusType.succeeded}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: RequestStatusType.loading}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: RequestStatusType.succeeded}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id, title}))
            })
    }
}

// types
export enum FilterValuesType {
    all = 'all',
    active = 'active',
    completed = 'completed'
}

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

