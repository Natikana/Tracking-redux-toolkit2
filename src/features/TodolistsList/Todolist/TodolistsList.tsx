import React, {FC, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {
    todoThunk,
} from './todolists-reducer'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist'
import {Redirect} from 'react-router-dom'
import {selectTodo} from "features/TodolistsList/Todolist/todolists.selector"
import {selectAuth} from "features/Login/auth.selectors"
import {useActions} from "hooks/useAction"

type Props = {
    demo?: boolean
}

export const TodolistsList: FC<Props> = ({demo = false}) => {
    const todolists = useSelector(selectTodo)
    const isLoggedIn = useSelector(selectAuth)

    const {
        fetchTodolists,
        addTodolist: addTodolistThunk,
    } = useActions(todoThunk)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])

    const addTodolist = (title: string) => {
        return addTodolistThunk({title}).unwrap()
    }

    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    return <>
        <Grid container style={{justifyContent:'center', padding: '30px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3} style={{justifyContent:'center'}} >
            {
                todolists.map(tl => {
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
