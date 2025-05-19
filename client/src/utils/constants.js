export const HOST = import.meta.env.SERVER_URL;

export const AUTH_ROUTE = "api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTE}/user-info`;
export const UPDATE_USER_INFO_ROUTE = `${AUTH_ROUTE}/update-user-info`;
