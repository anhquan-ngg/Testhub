import { UserExam, User, Exam, Submission } from '../models/index.js';
import sequelize from 'sequelize';

// Đăng ký bài thi
export const registerExam = async (req, res) => {
  try {
    // Kiểm tra xem đã đăng ký chưa
    const  { user_id, exam_id } = req.body;
    const existingRegistration = await UserExam.findOne({
      where: { user_id, exam_id }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Bạn đã đăng ký bài thi này rồi' });
    }

    // Kiểm tra exam có tồn tại không
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return res.status(404).json({ message: 'Bài thi không tồn tại' });
    }

    // Tạo đăng ký mới
    const registration = await UserExam.create({
      user_id,
      exam_id,
      status: 'registered'
    });


    return res.status(201).json({
      message: 'Đăng ký bài thi thành công',
      registration
    });
  } catch (error) {
    console.error('Error registering exam:', error);
    return res.status(500).json({ message: 'Server bị lỗi' });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { examId, userId } = req.params;
    const registration = await UserExam.findOne({
      where: { user_id: userId, exam_id: examId }
    });
    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }
    res.status(200).json(registration);
  } catch (error) {
    console.error('Error fetching registration status:', error);
    throw new Error('Server bị lỗi');
  }
}

// Lấy danh sách bài thi đã đăng ký
export const getStudentRegistrations = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: 'Thiếu thông tin sinh viên' });
    }

    const registrations = await UserExam.findAll({
      where: { user_id: studentId },
      include: [
        {
          model: Exam,
          attributes: [
            'title', 
            'subject', 
            'duration',
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM submissions
                WHERE 
                  submissions.student_id = ${studentId}
                  AND submissions.exam_id = "Exam".id
              )`),
              'submissionCount'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM submissions
                WHERE 
                  submissions.student_id = ${studentId}
                  AND submissions.exam_id = "Exam".id
                  AND submissions.is_correct = true
              )`),
              'correctCount'
            ]
          ],
          include: [
            {
              model: Submission,
              attributes: ['time_spent'],
              where: { student_id: studentId },
              required: false // Makes it a LEFT JOIN
            }
          ]
        }
      ]
    });
    console.log('Registrations:', registrations);
    return res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching student registrations:', error);
    return res.status(500).json({ message: 'Server bị lỗi' });
  }
};



