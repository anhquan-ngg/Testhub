import { DataTypes } from "sequelize";
import sequelize from '../db';

const Result = sequelize.define('result', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'exams',
            key: 'id'
        }
    },
    total_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    total_questions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    correct_answers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    wrong_answers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    finished_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER, // thời gian làm bài tính bằng giây
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('completed', 'in_progress', 'abandoned'),
        allowNull: false,
        defaultValue: 'in_progress'
    },
    passing_score: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    is_passed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'results',
    indexes: [
        {
            fields: ['user_id', 'exam_id'],
            unique: false
        }
    ]
});

export default Result;