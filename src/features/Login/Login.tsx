import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Button, Grid} from '@material-ui/core'
import {FormikHelpers, useFormik} from 'formik'
import {useDispatch, useSelector} from 'react-redux'
import {selectAuth} from "features/Login/auth.selectors";
import {authThunk} from "./auth-reducer";
import {AppDispatch} from "../../app/store";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {FieldsErrorsType, LoginParamsType, RequestStatus} from "../../api/todolists-api";
import {Redirect} from "react-router-dom";
import {handleServerAppError} from "../../utils/error-utils";

export const Login = () => {

    const dispatch = useDispatch<AppDispatch>()

    const isLoggedIn = useSelector(selectAuth);

    const formik = useFormik({
        validate: (values) => {
            /* if (!values.email) {
                 return {
                     email: 'Email is required'
                 }
             }
             if (!values.password) {
                 return {
                     password: 'Password is required'
                 }
             }*/

        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(authThunk.login(values))
                .unwrap()
                .then(res => {
                    console.log(res)
                })
                .catch(e => {
                    console.log(e)
                    const fieldError:FieldsErrorsType[] = e.fieldsErrors
                    if(e.fieldsErrors.length) {
                        fieldError.forEach(el => {
                            formikHelpers.setFieldError(el.field,el.error)
                        })

                    }
                    if(!e.fieldsErrors)
                    dispatch(setAppErrorAC({error:e.messages[0]}))

                })
                .finally(() => {
                    dispatch(setAppStatusAC({status: RequestStatus.failed}))
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
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
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
