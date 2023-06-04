import {createSlice} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {createAppAsyncThunk} from "common/createAppAsyncThunk/createAppAsyncThunk";
import {todoThunk} from "../Todolist/todolists-reducer";
import {tasksApi, TasksStateType, TaskType, UpdateDomainTaskModelType, UpdateTaskType} from "./tasks.api.ts/tasks.api";
import {ResultCode} from "enums/enums";

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, { todolistId: string }>
('tasks/fetchTasks', async (arg, thunkAPI) => {
        const res = await tasksApi.getTasks(arg.todolistId)
        const tasks = res.data.items
        return {tasks, todolistId: arg.todolistId}

})
const removeTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, { todolistId: string, taskId: string }>
('tasks/removeTask', async (arg) => {
        const res = await tasksApi.deleteTask(arg.todolistId, arg.taskId)
        return {todolistId: arg.todolistId, taskId: arg.taskId}

})
const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string, todolistId: string }>
('tasks/addTask',  async (arg, {rejectWithValue}) => {
        const res = await tasksApi.createTask(arg.todolistId, arg.title)
        if (res.data.resultCode === ResultCode.succeeded) {
            const task = res.data.data.item
            return {task}
        } else {
            return rejectWithValue({value:res.data, showError:false})
        }
})

const updateTask = createAppAsyncThunk<UpdateTaskType, UpdateTaskType>
('tasks/updateTask', async (arg,{getState, dispatch, rejectWithValue}) => {
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            console.log('The task was not found in the state')
            return rejectWithValue({value:null, showError:true})
        }
        const apiModel: UpdateDomainTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.model
        }

        const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel)

        if (res.data.resultCode === ResultCode.succeeded) {
            return arg
        } else {
            return rejectWithValue({value:res.data, showError:true})
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


