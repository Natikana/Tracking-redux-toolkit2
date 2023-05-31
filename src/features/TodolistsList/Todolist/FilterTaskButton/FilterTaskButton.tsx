import React, {FC, memo} from "react";
import {Button} from "@material-ui/core";
import {FilterValuesType} from "types/types";
import {useActions} from "hooks/useAction";
import {slice} from "../todolists-reducer";
import {TodolistDomainType} from "../todokists.api.ts/todokists.api";


type Props = {
    todolist: TodolistDomainType
}

export const FilterTaskButton:FC<Props> = memo(({todolist}) => {
    const {changeTodolistFilterAC} = useActions(slice.actions)

    const onChangeFilterHandler = (filter:FilterValuesType) => {
        changeTodolistFilterAC({id: todolist.id, filter})
    }

    return (
        <>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={() => onChangeFilterHandler(FilterValuesType.all)}
                    color={'default'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={() => onChangeFilterHandler(FilterValuesType.active)}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={() => onChangeFilterHandler(FilterValuesType.completed)}
                    color={'secondary'}>Completed
            </Button>
        </>
    )
})