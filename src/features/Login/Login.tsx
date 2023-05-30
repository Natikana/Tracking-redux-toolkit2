import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Button, Grid} from '@material-ui/core'
import {FormikHelpers, useFormik} from 'formik'
import {useDispatch, useSelector} from 'react-redux'
import {selectAuth} from "features/Login/auth.selectors";
import {authThunk} from "./auth-reducer";
import {AppDispatch} from "app/store";
import {slice} from "app/app-reducer";
import {FieldsErrorsType, LoginParamsType, RequestStatus} from "api/todolists-api";
import {Redirect} from "react-router-dom";
import {handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {useActions} from "hooks/useAction";


const isConnectionError = (e: AxiosError<{ error: string }> | Error) => {
    return !e.hasOwnProperty('resultCode')
}

export const Login = () => {

    const dispatch = useDispatch<AppDispatch>()
    const isLoggedIn = useSelector(selectAuth)
    const {login} = useActions(authThunk)
    const {setAppErrorAC, setAppStatusAC} = useActions(slice.actions)

    const formik = useFormik({
        validate: (values) => {
            const errors = {} as LoginParamsType;
            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 6) {
                errors.password = 'Must be 6 characters or more';
            }

            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            return errors;
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },

        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
           login(values)
                .unwrap()
                .then(res => {
                    console.log(res)
                })
                .catch(e => {
                    const {fieldsErrors} = e as {fieldsErrors: FieldsErrorsType[]}
                    if(isConnectionError(e)) {
                        handleServerNetworkError(e, dispatch)
                        return;
                    }

                    if(e.fieldsErrors.length) {
                        fieldsErrors.forEach((el) => {
                            formikHelpers.setFieldError(el.field,el.error)
                        })
                        return;
                    }
                    setAppErrorAC({error:e.messages[0]})
                })
                .finally(() => {
                    setAppStatusAC({status: RequestStatus.failed})
                    }
                )
        },

    })

    if (isLoggedIn) {
        return <Redirect to={"/"}/>
    }


    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                                        target={'_blank'}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
