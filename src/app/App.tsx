import React, {FC, useEffect} from 'react'
import './App.css'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {TodolistsList} from 'features/TodolistsList/Todolist/TodolistsList'
import {ErrorSnackbar} from 'components/ErrorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom'
import {Login} from 'features/Login/Login'
import {authThunk} from 'features/Login/auth-reducer'
import {selectAuth} from "features/Login/auth.selectors";
import {selectInitialized, selectStatus} from "app/app.selectors";
import {useActions} from "hooks/useAction";

type Props = {
    demo?: boolean
}

export const App: FC<Props> = ({demo = false}) => {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectInitialized)
    const isLoggedIn = useSelector(selectAuth)
    const {initializeApp, logout} = useActions(authThunk)


    useEffect(() => {
        initializeApp()
    }, [])

    const logoutHandler = () => logout()

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                </Container>
            </div>
        </BrowserRouter>
    )
}

