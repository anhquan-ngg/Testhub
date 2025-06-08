import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ExamQuestion = sequelize.define('ExamQuestion', {
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Exam',
            key: 'id'
        }
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Question',
            key: 'id'
        }
    },
}, {
    tableName: 'exam_questions',
    timestamps: false
});

export default ExamQuestion; 