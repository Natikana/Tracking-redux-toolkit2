import {RequestStatus, todolistsAPI, TodolistType} from 'api/todolists-api'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {createAppAsyncThunk} from "common/createAppAsyncThunk/createAppAsyncThunk";
import {thunkTryCatch} from "common/thunk-try-catch/thunk-try-catch";


const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>
('todolists/addTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await todolistsAPI.createTodolist(arg.title)
        return {todolist: res.data.data.item}
    })
})

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>
('todolists/removeTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () =>{
        dispatch(changeTodolistEntityStatusAC({id: arg.todolistId, entityStatus: RequestStatus.loading}))
        const res = await todolistsAPI.deleteTodolist(arg.todolistId)
        return {todolistId: arg.todolistId}
    })
})

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>
('todolists/fetchTodolists', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await todolistsAPI.getTodolists()
        return {todolists: res.data}
    })
})

const changeTodolistTitle = createAppAsyncThunk<{ todolistId: string, title: string }, { todolistId: string, title: string }>
('todolists/changeTodolistTitle', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () =>{
        const res = todolistsAPI.updateTodolist(arg.todolistId, arg.title)
        return {todolistId: arg.todolistId, title: arg.title}
    })
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

