import {AppRootStateType} from "app/store";

export const selectAuth = (state:AppRootStateType) => state.auth.isLoggedIn