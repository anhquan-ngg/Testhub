import { DataTypes, DATE } from 'sequelize';
import sequelize from '../db.js';
import { text } from 'express';

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject: {
        type: DataTypes.ENUM('math', 'english', 'physics', 'chemistry'),
        allowNull: false
    },
    img_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('single-choice', 'multiple-choice', 'fill-in-blank'),
        allowNull: false
    },
    options: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    correct_answer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
}, {
    tableName: 'questions',
    timestamps: false
})

export default Question;