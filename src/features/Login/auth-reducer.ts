import {AnyAction, Dispatch} from 'redux'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";

const initialState = {
    isLoggedIn: false
}
export const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})
export default slice.reducer
export const {setIsLoggedInAC} = slice.actions

/*export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}*/
// actions
/*export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)*/
// thunks
export type ActionType<T = AnyAction> = T extends AnyAction ? T : never
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionType/*SetAppStatusActionType | SetAppErrorActionType*/>) => {
    dispatch(setAppStatusAC({status: RequestStatusType.loading}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status: RequestStatusType.succeeded}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC({status: RequestStatusType.loading}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {

                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: RequestStatusType.succeeded}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types

/*type ActionsType = ReturnType<typeof setIsLoggedInAC>
type InitialStateType = {
    isLoggedIn: boolean
}*/

//type ThunkDispatch = Dispatch< SetAppStatusActionType | SetAppErrorActionType>
