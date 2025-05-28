import { Router } from 'express';
import { getAllExams, getExamDetail, updateExam, deleteExam } from '../controllers/ExamController.js';

const examRoutes = Router();

// GET
examRoutes.get('/exams-list', getAllExams); // Lấy danh sách bài thi
examRoutes.get('/exam-detail/:id',getExamDetail);
// POST 

// PUT 
examRoutes.put('/exam-update/:id',updateExam);
// DELETE
examRoutes.delete('/exam-delete/:id',deleteExam);

export default examRoutes;