import { DataTypes } from 'sequelize'
import sequelize from '../db.js'
import User from './UserModel.js'
import Exam from './ExamModel.js'
import Question from './QuestionModel.js'

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Exam,
            key: 'id'
        }
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question,
            key: 'id'
        }
    },
    selected_choice: {
        type: DataTypes.JSONB, // Using JSONB to store multiple choices for multiple-choice questions
        allowNull: true,
    },
    answer_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    time_spent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'submissions',
    timestamps: false,
    indexes: [
        {
            fields: ['result_id', 'question_id'],
            unique: true
        },
        {
            fields: ['user_id', 'exam_id', 'question_id'],
            unique: false
        }
    ]
});

export default Submission;