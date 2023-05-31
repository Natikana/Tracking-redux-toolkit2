import React, {FC} from "react";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TodolistDomainType} from "../todokists.api.ts/todokists.api";
import {useActions} from "hooks/useAction";
import {todoThunk} from "../todolists-reducer";

type Props = {
    todolist: TodolistDomainType
}

export const TodoListTitle:FC<Props> = ({todolist}) => {
    const {removeTodolist, changeTodolistTitle} = useActions(todoThunk)

    const removeTodo = () => removeTodolist({todolistId: todolist.id})
    const changeTodoTitle = (title: string) => changeTodolistTitle({todolistId: todolist.id, title})
    return (
        <h3>
            <EditableSpan value={todolist.title} onChange={changeTodoTitle}/>
            <IconButton onClick={removeTodo} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
    )
}
