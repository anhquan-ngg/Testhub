import User from './UserModel.js';
import Exam from './ExamModel.js';
import Question from './QuestionModel.js';
import ExamQuestion from './ExamQuestionModel.js';
import Submission from './SubmissionModel.js';
import UserExam from './UserExamModel.js';

// User associations
User.hasMany(Submission, { foreignKey: 'student_id' });
Submission.belongsTo(User, { foreignKey: 'student_id' });

User.belongsToMany(Exam, { through: UserExam, foreignKey: 'user_id' });
Exam.belongsToMany(User, { through: UserExam, otherKey: 'user_id', foreignKey: 'exam_id' });
UserExam.belongsTo(User, { foreignKey: 'user_id' });
UserExam.belongsTo(Exam, { foreignKey: 'exam_id' });

// Exam associations
Exam.hasMany(Submission, { foreignKey: 'exam_id' });
Submission.belongsTo(Exam, { foreignKey: 'exam_id' });

// Question associations
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

export { User, Exam, Question, ExamQuestion, Submission, UserExam };