import { DataTypes } from 'sequelize'
import sequelize from '../db'
import Result from './ResultModel';

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    result_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Result,
            key: 'id'
        }
    },
    user_id: {
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
    selected_choice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Choice,
            key: 'id'
        }
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
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    time_spent: {
        type: DataTypes.INTEGER, // thời gian trả lời câu hỏi (giây)
        allowNull: true
    },
    submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'submissions',
    timestamps: true,
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