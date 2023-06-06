import {tasksReducer} from 'features/TodolistsList/tasks/tasks-reducer';
import {todolistsReducer} from 'features/TodolistsList/Todolist/todolists-reducer';
import {AnyAction, combineReducers} from 'redux'
import appReducer from './app-reducer'
import authReducer from 'features/Login/auth-reducer'
import {configureStore} from "@reduxjs/toolkit";
import {ThunkAction} from 'redux-thunk'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    AppRootStateType,
    unknown,
    AnyAction>
// @ts-ignore
window.store = store;
