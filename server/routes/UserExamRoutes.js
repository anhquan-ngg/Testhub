import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { 
  registerExam, 
  getStudentRegistrations, 
  getStatus
} from '../controllers/UserExamController.js';

const userExamRoutes = Router();

// Đăng ký bài thi
userExamRoutes.post('/register', verifyToken, registerExam);

// Lấy danh sách bài thi đã đăng ký
userExamRoutes.get('/student/:studentId', verifyToken, getStudentRegistrations);

// Kiểm tra trạng thái đăng ký
userExamRoutes.get('/get-status/:userId/:examId', verifyToken, getStatus);

export default userExamRoutes;