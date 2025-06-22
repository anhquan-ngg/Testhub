import { Exam, Question, ExamQuestion } from '../models/index.js';
import sequelize from '../db.js';

export const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server bị lỗi'});
  }
};

export const getRecentExams = async (req, res, next) => {
  try {
    const exams = await Exam.findAll({
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    // Cập nhật status dựa trên thời gian
    const currentTime = new Date();
    const updatedExams = exams.map(exam => {
      const examData = exam.get({ plain: true });
      const startTime = new Date(examData.start_time);
      const endTime = new Date(examData.end_time);

      if (currentTime < startTime) {
        examData.status = 'pending';
      } else if (currentTime >= startTime && currentTime <= endTime) {
        examData.status = 'active';
      } else {
        examData.status = 'finished';
      }

      return examData;
    });

    res.status(200).json(updatedExams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server bị lỗi'});
  }
}

export const getExamDetail = async (req, res, next) => {
    try {
      const { id } = req.params;
      const exam = await Exam.findOne({
        where: { id: id },
        include: [{
          model: Question,
          as: 'questions',
          through: {
            model: ExamQuestion,
            attributes: []  // Không lấy thuộc tính của bảng trung gian
          },
          attributes: ['id', 'text', 'subject', 'type', 'options', 'correct_answer', 'img_url', 'created_by']
        }]
      });
      
      if (!exam) {
        return res.status(404).json({ message: 'Không tìm thấy bài thi' });
      }

      res.status(200).json(exam);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
};

export const addExam = async (req, res, next) => {
  try {
    const { title, subject, teacher_id, duration, start_time, end_time, questions} = req.body;

    const transaction = await sequelize.transaction();

    try {
      const exam = await Exam.create({ title, subject, teacher_id, duration, start_time, end_time}, { transaction});

      if (!questions){
        return res.status(400).json({ message: 'Không có câu hỏi để thêm vào bài thi'});
      }

      const examQuestions = questions.map(question => ({
        exam_id: exam.id,
        question_id: question.id
      }));
      await ExamQuestion.bulkCreate(examQuestions, { transaction });
      
      await transaction.commit();

      res.status(201).json({ message: 'Bài thi đã được thêm thành công'});
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server bị lỗi'});
  }
}

export const updateExam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            subject, 
            duration, 
            start_time, 
            end_time,
            questions // Mảng các id câu hỏi mới
        } = req.body;

        // Tìm bài thi
        const exam = await Exam.findByPk(id);

        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        }

        // Bắt đầu transaction
        const transaction = await sequelize.transaction();

        try {
            // Cập nhật thông tin bài thi
            await exam.update({
                title,
                subject,
                duration,
                start_time,
                end_time
            }, { transaction });

            if (questions && Array.isArray(questions)) {
                // Xóa tất cả các liên kết câu hỏi cũ
                await ExamQuestion.destroy({
                    where: { exam_id: id },
                    transaction
                });

                // Thêm các liên kết câu hỏi mới
                const examQuestions = questions.map(question => ({
                    exam_id: id,
                    question_id: question.id // Lấy ID từ object câu hỏi
                }));
                
                await ExamQuestion.bulkCreate(examQuestions, { transaction });
            }

            // Commit transaction
            await transaction.commit();

            // Lấy thông tin bài thi đã cập nhật kèm câu hỏi
            const updatedExam = await Exam.findOne({
                where: { id },
                include: [{
                    model: Question,
                    as: 'questions',
                    through: {
                        model: ExamQuestion,
                        attributes: []
                    },
                    attributes: ['id', 'text', 'subject', 'type', 'options', 'correct_answer', 'img_url', 'created_by']
                }]
            });

            res.status(200).json(updatedExam);
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Server bị lỗi',
            error: error.message 
        });
    }
};

export const deleteExam = async (req, res, next) => {
    try {
      const { id } = req.params;
      const exam = await Exam.findByPk(id);
      if (!exam) {
        return res.status(404).json({ message: 'Bài thi không tồn tại'});
      }
      await exam.destroy();
      res.status(200).json({ message: 'Bài thi đã được xóa thành công'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
};