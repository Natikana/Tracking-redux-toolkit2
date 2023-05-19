import {RequestStatus, todolistsAPI, TodolistType} from 'api/todolists-api'
import {setAppStatusAC} from 'app/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {createAppAsyncThunk} from "../../common/createAppAsyncThunk/createAppAsyncThunk";


const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>
('todolists/addTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await todolistsAPI.createTodolist(arg.title)
        dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
        return {todolist: res.data.data.item}
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>
('todolists/removeTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        dispatch(changeTodolistEntityStatusAC({id: arg.todolistId, entityStatus: RequestStatus.loading}))
        const res = await todolistsAPI.deleteTodolist(arg.todolistId)
        dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
        return {todolistId: arg.todolistId}
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>
('todolists/fetchTodolists', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await todolistsAPI.getTodolists()
        dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
        return {todolists: res.data}
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

const changeTodolistTitle = createAppAsyncThunk<{ todolistId: string, title: string }, { todolistId: string, title: string }>
('todolists/changeTodolistTitle', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = todolistsAPI.updateTodolist(arg.todolistId, arg.title)
        dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
        return {todolistId: arg.todolistId, title: arg.title}

    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

const todoInitialState: Array<TodolistDomainType> = []

export const slice = createSlice({
    name: 'todolists',
    initialState: todoInitialState,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const indexTodo = state.findIndex(el => el.id === action.payload.id)
            if (indexTodo !== -1) {
                state[indexTodo].filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatus }>) {
            const indexTodo = state.findIndex(el => el.id === action.payload.id)
            if (indexTodo !== -1) {
                state[indexTodo].entityStatus = action.payload.entityStatus
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const todoIndex = state.findIndex(el => el.id === action.payload.todolistId)
                if (todoIndex !== -1) state[todoIndex].title = action.payload.title
            })
            .addCase(changeTodolistTitle.rejected, () => {

            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({
                    ...action.payload.todolist,
                    filter: FilterValuesType.all,
                    entityStatus: RequestStatus.idle
                })
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const todoIndex = state.findIndex(el => el.id === action.payload.todolistId)
                if (todoIndex !== -1) state.splice(todoIndex, 1)
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(el => ({
                    ...el,
                    filter: FilterValuesType.all,
                    entityStatus: RequestStatus.idle
                }))
            })
            .addCase(commonActions, () => {
                return []
            })
    }
})
export const todolistsReducer = slice.reducer
export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions
export const todoThunk = {fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle}


// types
export enum FilterValuesType {
    all = 'all',
    active = 'active',
    completed = 'completed'
}

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatus
}

