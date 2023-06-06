import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

type Props = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({disabled = false, addItem}) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title)
                .then(() => {
                    setTitle("")
                })
                .catch((e) => {
                    if (e.message) return
                    else if (!e.showError) {
                        setError(e.value.messages[0])
                    }
                })
        } else {
            setError("Title is required")
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        } else if (e.charCode === 13) {
            addItemHandler();
        }
    }


    return <div>
        <TextField
            variant="outlined"
            disabled={disabled}
            error={!!error}
            value={title}
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            label="Title"
            helperText={error}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
            <AddBox/>
        </IconButton>
    </div>
})
