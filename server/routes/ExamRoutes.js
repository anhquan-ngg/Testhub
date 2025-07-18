import { Router } from 'express';
import { getAllExams, getRecentExams, getExamDetail, addExam, updateExam, deleteExam } from '../controllers/ExamController.js';

const examRoutes = Router();

// GET
examRoutes.get('/list-exams', getAllExams); // Lấy danh sách bài thi
examRoutes.get('/detail-exam/:id',getExamDetail);
examRoutes.get('/recent-exams',getRecentExams);
// POST 
examRoutes.post('/add-exam',addExam);
// PUT 
examRoutes.patch('/update-exam/:id',updateExam);
// DELETE
examRoutes.delete('/delete-exam/:id',deleteExam);

export default examRoutes;