import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const UserExam = sequelize.define('UserExam', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Exam',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: true, // Score can be null if the exam hasn't been taken yet
        defaultValue: 0.0 // Default score is 0.0
    },
    status: {
        type: DataTypes.STRING,
        enum: ['Đã đăng ký', 'Đã nộp bài'],
        allowNull: false,
        defaultValue: 'Đã đăng ký' // Possible values could be 'in_progress', 'completed', etc.
    }
}, {
    tableName: 'user_exams',
    timestamps: true // This will add createdAt and updatedAt fields
})