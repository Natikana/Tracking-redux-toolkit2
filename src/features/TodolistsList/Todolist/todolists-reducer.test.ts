import {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistDomainType,
    todolistsReducer, todoThunk
} from './todolists-reducer'
import {v1} from 'uuid'
import {RequestStatus, TodolistType} from '../../../api/todolists-api'


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {
            id: todolistId1,
            title: 'What to learn',
            filter: FilterValuesType.all,
            entityStatus: RequestStatus.idle,
            addedDate: '',
            order: 0
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: FilterValuesType.all,
            entityStatus: RequestStatus.idle,
            addedDate: '',
            order: 0
        }
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, todoThunk.removeTodolist.fulfilled(
        {todolistId: todolistId1},
        '',
        {todolistId: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let todolist: TodolistType = {
        title: 'New Todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }


    const endState = todolistsReducer(startState, todoThunk.addTodolist.fulfilled({todolist}, '', {title: todolist.title}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist'

    const action = todoThunk.changeTodolistTitle.fulfilled(
        {todolistId: todolistId2, title: newTodolistTitle},
        '',
        {title: newTodolistTitle, todolistId: todolistId2}
    )

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {


    const action = changeTodolistFilterAC({id: todolistId2, filter: FilterValuesType.completed})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('completed')
})
test('todolists should be added', () => {

    const action = todoThunk.fetchTodolists.fulfilled(
        {todolists: startState},
        ''
    )

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})
test('correct entity status of todolist should be changed', () => {

    const action = changeTodolistEntityStatusAC({id: todolistId2, entityStatus: RequestStatus.succeeded})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe('succeeded')
})



