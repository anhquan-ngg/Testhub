import { Router } from 'express';
import { getAllQuestions, getDetailQuestion, addQuestion, updateQuestion, deleteQuestion } from '../controllers/QuestionController.js';


const questionRoutes = Router();
// GET 
questionRoutes.get('/list-questions', getAllQuestions);
questionRoutes.get('/detail-question/:id', getDetailQuestion);
// POST 
questionRoutes.post('/add-question', addQuestion);
// PATCH 
questionRoutes.patch('/patch-question/:id', updateQuestion);
// DELETE
questionRoutes.delete('/delete-question/:id', deleteQuestion);

export default questionRoutes;