import {authAPI, RequestStatus, ResultCode} from 'api/todolists-api'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../common/createAppAsyncThunk/createAppAsyncThunk";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerNetworkError} from "../utils/error-utils";

const initializeApp = createAppAsyncThunk<{isInitialized: true}>
('app/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
        return {isInitialized: true}

    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }

})
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
       /* setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }*/
    },
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isInitialized = action.payload.isInitialized
            })
    }
})
export default slice.reducer
export const {setAppErrorAC, setAppStatusAC} = slice.actions
export const appThunk = {initializeApp}

