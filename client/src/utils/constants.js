export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = "api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTE}/user-info`;
export const UPDATE_USER_INFO_ROUTE = `${AUTH_ROUTE}/update-user-info`;

export const USERS_ROUTE = "api/users"; 
export const GET_LIST_USERS_ROUTE = `${USERS_ROUTE}/list-users`;  // Admin
export const ADD_USER_ROUTE = `${USERS_ROUTE}/add-user`; // Admin
export const GET_DETAIL_USER_ROUTE = `${USERS_ROUTE}/detail-user`; // Admin / Teacher
export const PATCH_USER_ROUTE = `${USERS_ROUTE}/patch-user`;   // Admin / Self
export const DELETE_USER_ROUTE = `${USERS_ROUTE}/delete-user`; // Admin

export const EXAMS_ROUTE = "api/exams";
export const GET_LIST_EXAMS_ROUTE = `${EXAMS_ROUTE}/list-exams`; // Teacher / Student
export const GET_DETAIL_EXAM_ROUTE = `${EXAMS_ROUTE}/detail-exam/:id`; // Teacher / Student
export const ADD_EXAM_ROUTE = `${EXAMS_ROUTE}/add-exam`; // Teacher
export const PATCH_EXAM_ROUTE = `${EXAMS_ROUTE}/patch-exam/:id`; // Teacher
export const DELETE_EXAM_ROUTE = `${EXAMS_ROUTE}/delete-exam/:id`; // Teacher

export const QUESTION_ROUTE = "api/questions"; 
export const ADD_QUESTION_ROUTE = `${QUESTION_ROUTE}/add-question`; // Teacher
export const GET_DETAIL_QUESTION_ROUTE = `${QUESTION_ROUTE}/detail-question/:id`; // Teacher
export const PATCH_QUESTION_ROUTE = `${QUESTION_ROUTE}/patch-question/:id`; // Teacher 
export const DELETE_QUESTION_ROUTE = `${QUESTION_ROUTE}/delete-question/:id`; // Teacher

export const ADD_QUESTION_TO_EXAM_ROUTE = `${EXAMS_ROUTE}/add-question-to-exam/:id`; // Teacher
export const GET_LIST_QUESTION_OF_EXAM_ROUTE = `${EXAMS_ROUTE}list-question-of-exam/:id`; // Teacher/ Student
export const DELETE_QUESTION_FROM_EXAM_ROUTE = `${EXAMS_ROUTE}/delete-question-from-exam/:id`; // Teacher

export const ADD_SUBMISSION_ROUTE = `${EXAMS_ROUTE}/submission/:id`; // Student
export const GET_LIST_SUBMISSION_ROUTE = `${EXAMS_ROUTE}/list-submission/:id`; // Teacher
export const GET_DETAIL_SUBMISSION_ROUTE = `${EXAMS_ROUTE}/detail-submission/:id`; // Teacher/Student

export const RESULT_ROUTE = "api/results"; 
export const GET_RESULT_BY_USER_ROUTE = `${RESULT_ROUTE}/list-result-by-user/:id`; // Teacher / Student
export const GET_LIST_RESULT_BY_EXAM_ROUTE = `${EXAMS_ROUTE}/list-result-by-exam/:id`; // Teacher / Student

export const PROCTORING_ROUTE = "api/proctoring"; 
export const LOG_PROCTORING_ROUTE = `${PROCTORING_ROUTE}/log-proctoring/`; // Student (Auto)
export const GET_LIST_PROCTORING_BY_EXAM_ROUTE = `${EXAMS_ROUTE}/list-proctoring-by-exam/:id`; // Teacher

