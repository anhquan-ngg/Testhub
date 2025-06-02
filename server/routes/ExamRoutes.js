import { Router } from 'express';
import { getAllExams, getExamDetail, addExam, updateExam, deleteExam } from '../controllers/ExamController.js';

const examRoutes = Router();

// GET
examRoutes.get('/list-exams', getAllExams); // Lấy danh sách bài thi
examRoutes.get('/exam-detail/:id',getExamDetail);
// POST 
examRoutes.post('/add-exam',addExam);
// PUT 
examRoutes.put('/exam-update/:id',updateExam);
// DELETE
examRoutes.delete('/exam-delete/:id',deleteExam);

export default examRoutes;