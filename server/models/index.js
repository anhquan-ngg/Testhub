import Exam from './ExamModel.js';
import Question from './QuestionModel.js';
import ExamQuestion from './ExamQuestionModel.js';

// Thiết lập quan hệ many-to-many
Exam.belongsToMany(Question, {
    through: ExamQuestion,
    foreignKey: 'exam_id',
    otherKey: 'question_id',
    as: 'questions'
});

Question.belongsToMany(Exam, {
    through: ExamQuestion,
    foreignKey: 'question_id',
    otherKey: 'exam_id',
    as: 'exams'
});

export {
    Exam,
    Question,
    ExamQuestion
}; 