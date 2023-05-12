import {authAPI, LoginParamsType} from 'api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {commonActions} from "common/commonActions/commonActions";
import {AppThunk} from "app/store";

const authInitialState = {
    isLoggedIn: false
}
export const slice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})
export default slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType):AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: RequestStatusType.loading}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({isLoggedIn: true}))
                dispatch(setAppStatusAC({status: RequestStatusType.succeeded}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = ():AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: RequestStatusType.loading}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({isLoggedIn: false}))
                dispatch(commonActions())
                dispatch(setAppStatusAC({status: RequestStatusType.succeeded}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

