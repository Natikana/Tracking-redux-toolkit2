import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatus} from "enums/enums";


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

    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => {
                   return action.type.endsWith('/pending')
                },
                (state, action) =>{
                    state.status = RequestStatus.loading
            })
            .addMatcher(
            (action) => {
                return action.type.endsWith('/rejected')

        },
        (state, action) =>{
            console.log(action)
            if(action.payload) {
                if(action.payload.showError) {
                    state.error = action.payload.value ? action.payload.value.messages[0] : 'Some error occurred'
                }
            } else {
                state.error = action.error ? action.error.message: 'Some error occurred'
            }
            state.status = RequestStatus.failed
        })
            .addMatcher(
                (action)=>{
                    return action.type.endsWith('/fulfilled')
                },
                (state, action)=>{
                    state.status = RequestStatus.idle
                })

}

})
export default slice.reducer
export const {setAppErrorAC, setAppStatusAC, setInitializedAC} = slice.actions


