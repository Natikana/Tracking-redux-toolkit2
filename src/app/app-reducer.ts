
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatus} from "../enums/enums";


const appInitialState = {
    status: RequestStatus.idle,
    error: null as null | string,
    isInitialized: false
}

export const slice = createSlice({
    name: 'app',
    initialState: appInitialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatus }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {

            state.error = action.payload.error
        },
        setInitializedAC(state, action:PayloadAction<{isInitialized:boolean}>) {
            state.isInitialized = action.payload.isInitialized
        }

    }
})
export default slice.reducer
export const {setAppErrorAC, setAppStatusAC, setInitializedAC} = slice.actions


