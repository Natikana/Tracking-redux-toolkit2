import {
    todoThunk,
} from './todolists-reducer'
import {
    RequestStatus, ResultCode,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType, UpdateTaskType
} from 'api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {setAppStatusAC} from "app/app-reducer";
import {createSlice} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {createAppAsyncThunk} from "common/createAppAsyncThunk/createAppAsyncThunk";

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, { todolistId: string }>('tasks/fetchTasks', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await todolistsAPI.getTasks(arg.todolistId)
        const tasks = res.data.items
        dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
        return {tasks, todolistId: arg.todolistId}

    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
const removeTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, { todolistId: string, taskId: string }>
('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
        dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
        return {todolistId: arg.todolistId, taskId: arg.taskId}

    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string, todolistId: string }>('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
        if (res.data.resultCode === ResultCode.succeeded) {
            const task = res.data.data.item
            dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const updateTask = createAppAsyncThunk<UpdateTaskType, UpdateTaskType>('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    try {
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            console.log('The task was not found in the state')
            return rejectWithValue(null)
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.model
        }

        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        dispatch(setAppStatusAC({status: RequestStatus.loading}))

        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const tasksInitialState: TasksStateType = {}
const slice = createSlice({
    name: 'tasks',
    initialState: tasksInitialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(updateTask.fulfilled, (state, action) => {
                const task = state[action.payload.todolistId]
                const taskIndex = task.findIndex(el => el.id === action.payload.taskId)
                if (taskIndex !== -1) task[taskIndex] = {...task[taskIndex], ...action.payload.model}
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const tasksIndex = tasks.findIndex(el => el.id === action.payload.taskId)
                if (tasksIndex !== -1) tasks.splice(tasksIndex, 1)
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(commonActions, () => {
                return {}
            })
            .addCase(todoThunk.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todoThunk.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todoThunk.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
    }
})
export const tasksReducer = slice.reducer
export const tasksThunk = {fetchTasks, removeTask, addTask, updateTask}

// types

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
