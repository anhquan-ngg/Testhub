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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    started_at: {
        type: DataTypes.TIME,
        allowNull: false
    },
    finish_at: {
        type: DataTypes.TIME,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'result'
});

export default Result;