import { RequestStatus} from 'api/todolists-api'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


/*const initializeApp = createAppAsyncThunk<{isLoggedIn: boolean}, void>
('app/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    debugger
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.succeeded) {
            return {isLoggedIn: true}
        } else {
            dispatch(setInitializedAC({isInitialized: true}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }

})*/
/*export const initializeAppTC = ():AppThunk => (dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
        dispatch(setAppInitializedAC({isInitialized: true}));
    })
}*/
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


