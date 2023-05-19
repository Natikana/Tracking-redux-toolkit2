import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {
    changeTodolistFilterAC,
    FilterValuesType,
     todoThunk,
} from './todolists-reducer'
import { tasksThunk} from './tasks-reducer'
import {TaskStatuses} from 'api/todolists-api'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from 'react-router-dom'
import {selectTasks} from "features/TodolistsList/tasks.selectors";
import {selectTodo} from "features/TodolistsList/todolists.selector";
import {selectAuth} from "features/Login/auth.selectors";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodo)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectAuth)

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(todoThunk.fetchTodolists())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(tasksThunk.removeTask({todolistId, taskId:id}))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunk.addTask({todolistId, title}))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunk.updateTask({taskId, model:{status}, todolistId}))
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        dispatch(tasksThunk.updateTask({taskId, model:{title}, todolistId}))
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC({id: todolistId, filter: value}))
    }, [])

    const removeTodolist = useCallback(function (todolistId: string) {
        dispatch(todoThunk.removeTodolist({todolistId}))
    }, [])

    const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
        dispatch(todoThunk.changeTodolistTitle({todolistId, title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(todoThunk.addTodolist({title}))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
