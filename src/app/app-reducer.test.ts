import appReducer, {setAppErrorAC, setAppStatusAC} from './app-reducer'
import {RequestStatus} from "../enums/enums";


type InitialStateType = {
    error: null | string,
    status: RequestStatus
    isInitialized:boolean
}
let startState: InitialStateType;

beforeEach(() => {
    startState = {
        error: null,
        status: RequestStatus.idle,
        isInitialized:false
    }
})

test('correct error message should be set', () => {

    const endState = appReducer(startState, setAppErrorAC({error:'some error'}))

    expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatusAC({status: RequestStatus.loading}))

    expect(endState.status).toBe('loading');
})

