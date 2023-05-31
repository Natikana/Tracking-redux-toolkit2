import React, {FC, memo, useEffect} from 'react'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {tasksThunk} from '../tasks/tasks-reducer'
import {useActions} from "hooks/useAction";
import {TodolistDomainType} from "./todokists.api.ts/todokists.api";
import {FilterTaskButton} from "./FilterTaskButton/FilterTaskButton";
import {Tasks} from "./Tasks/Tasks";
import {TodoListTitle} from "./TodoListTitle/TodoListTitle";

type Props = {
    todolist: TodolistDomainType
    demo?: boolean
}

export const Todolist:FC<Props> = memo( ({demo = false,todolist }) =>{
    console.log('Todolist called')

    const {fetchTasks, addTask} = useActions(tasksThunk)

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks({todolistId: todolist.id})
    }, [])

    const addTaskProps = (title: string) => {
        return addTask({title, todolistId: todolist.id}).unwrap()
    }

    return <div>
        <TodoListTitle todolist={todolist}/>
        <AddItemForm addItem={addTaskProps} disabled={todolist.entityStatus === 'loading'}/>
        <Tasks todolist={todolist}/>
        <div style={{paddingTop: '10px'}}>
        <FilterTaskButton todolist={todolist}/>
        </div>
    </div>
})


