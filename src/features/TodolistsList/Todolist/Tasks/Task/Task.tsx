import React, {ChangeEvent, FC, memo} from 'react'
import {Checkbox, IconButton} from '@material-ui/core'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import {Delete} from '@material-ui/icons'
import {TaskType} from "../../../tasks/tasks.api.ts/tasks.api"
import {TaskStatuses} from "enums/enums"
import {useActions} from "hooks/useAction"
import {tasksThunk} from "../../../tasks/tasks-reducer"
import style from "./task.module.css"

type Props = {
    task: TaskType
}
export const Task: FC<Props> = memo(({task}) => {
    console.log('task')
    const {removeTask, updateTask} = useActions(tasksThunk)
    const onRemoveTask = () => removeTask({taskId: task.id, todolistId: task.todoListId})

    const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            taskId:task.id,
            todolistId: task.todoListId,
            model: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}
        })
    }

    const onChangeTaskTitle = (newValue: string) => updateTask({
        taskId: task.id,
        todolistId: task.todoListId,
        model: {title: newValue}
    })

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? style.isDone  : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeTaskStatus}
        />

        <EditableSpan value={task.title} onChange={onChangeTaskTitle}/>
        <IconButton onClick={onRemoveTask}>
            <Delete/>
        </IconButton>
    </div>
})
