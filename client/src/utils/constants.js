export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = "api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTE}/user-info`;
export const UPDATE_USER_INFO_ROUTE = `${AUTH_ROUTE}/update-user-info`;

export const USERS_ROUTE = "api/users";
export const GET_LIST_USERS_ROUTE = `${USERS_ROUTE}/list-users`;
export const GET_RECENT_USERS_ROUTE = `${USERS_ROUTE}/recent-users`;
export const ADD_USER_ROUTE = `${USERS_ROUTE}/add-user`;
export const GET_DETAIL_USER_ROUTE = `${USERS_ROUTE}/detail-user`;
export const PATCH_USER_ROUTE = `${USERS_ROUTE}/patch-user`;
export const DELETE_USER_ROUTE = `${USERS_ROUTE}/delete-user`;

export const EXAMS_ROUTE = "api/exams";
export const GET_LIST_EXAMS_ROUTE = `${EXAMS_ROUTE}/list-exams`;
export const GET_RECENT_EXAMS_ROUTE = `${EXAMS_ROUTE}/recent-exams`;
export const GET_DETAIL_EXAM_ROUTE = `${EXAMS_ROUTE}/detail-exam`;
export const ADD_EXAM_ROUTE = `${EXAMS_ROUTE}/add-exam`;
export const PATCH_EXAM_ROUTE = `${EXAMS_ROUTE}/update-exam`;
export const DELETE_EXAM_ROUTE = `${EXAMS_ROUTE}/delete-exam`;

export const QUESTIONS_ROUTE = "api/questions";
export const GET_LIST_QUESTIONS_ROUTE = `${QUESTIONS_ROUTE}/list-questions`;
export const GET_DETAIL_QUESTION_ROUTE = `${QUESTIONS_ROUTE}/detail-question`;
export const ADD_QUESTION_ROUTE = `${QUESTIONS_ROUTE}/add-question`;
export const PATCH_QUESTION_ROUTE = `${QUESTIONS_ROUTE}/patch-question`;
export const DELETE_QUESTION_ROUTE = `${QUESTIONS_ROUTE}/delete-question`;

export const SUBMISSIONS_ROUTE = "api/submissions";
export const ADD_SUBMISSION_ROUTE = `${SUBMISSIONS_ROUTE}/add-submission`;

export const USER_EXAMS_ROUTE = "api/user-exams";
export const REGISTER_EXAM_ROUTE = `${USER_EXAMS_ROUTE}/register`;
export const GET_STUDENT_REGISTRATIONS_ROUTE = `${USER_EXAMS_ROUTE}/student`;
export const GET_EXAM_DETAILS_ROUTE = `${USER_EXAMS_ROUTE}/exam-details`;
export const GET_STATUS_ROUTE = `${USER_EXAMS_ROUTE}/get-status`;