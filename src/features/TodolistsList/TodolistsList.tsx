import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'

import {
    FilterValuesType, slice,
    todoThunk,
} from './todolists-reducer'
import {tasksThunk} from './tasks-reducer'
import {TaskStatuses} from 'api/todolists-api'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from 'react-router-dom'
import {selectTasks} from "features/TodolistsList/tasks.selectors";
import {selectTodo} from "features/TodolistsList/todolists.selector";
import {selectAuth} from "features/Login/auth.selectors";
import {useActions} from "hooks/useAction";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodo)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectAuth)

    const {removeTask: removeTaskThunk, addTask: addTaskThunk, updateTask} = useActions(tasksThunk)
    const {
        fetchTodolists,
        removeTodolist: removeTodolistThunk,
        addTodolist: addTodolistThunk,
        changeTodolistTitle: changeTodolistTitleThunk
    } = useActions(todoThunk)
    const {changeTodolistFilterAC} = useActions(slice.actions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])

    const removeTask = (taskId: string, todolistId: string) => removeTaskThunk({todolistId, taskId})

    const addTask = (title: string, todolistId: string) => addTaskThunk({todolistId, title})


    const changeStatus = (taskId: string, status: TaskStatuses, todolistId: string) => updateTask({
        taskId,
        model: {status},
        todolistId
    })


    const changeTaskTitle = (taskId: string, title: string, todolistId: string) => updateTask({
        taskId,
        model: {title},
        todolistId
    })

    const changeFilter = (value: FilterValuesType, todolistId: string) => changeTodolistFilterAC({
        id: todolistId,
        filter: value
    })
    const removeTodolist = (todolistId: string) => removeTodolistThunk({todolistId})
    const changeTodolistTitle = (todolistId: string, title: string) => changeTodolistTitleThunk({todolistId, title})
    const addTodolist = (title: string) => addTodolistThunk({title})

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
