import React, {FC, memo} from "react";
import {Task} from "./Task/Task";
import {TaskType} from "../../tasks/tasks.api.ts/tasks.api";
import {TaskStatuses} from "enums/enums";
import {useSelector} from "react-redux";
import {selectTasks} from "../../tasks/tasks.selectors";
import {TodolistDomainType} from "../todokists.api.ts/todokists.api";

type Props = {
    todolist: TodolistDomainType
}

export const Tasks:FC<Props> = memo(({todolist}) => {
    const tasks = useSelector(selectTasks)

    let tasksForTodolist:TaskType[] = tasks[todolist.id]

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks[todolist.id].filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks[todolist.id].filter(t => t.status === TaskStatuses.Completed)
    }
    return (
        <>
            {
                tasksForTodolist?.map(t => <Task key={t.id} task={t}/>)
            }
        </>
    )
})