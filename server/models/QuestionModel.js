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
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('single-choice', 'multiple-choice', 'fill-in-blank'),
        allowNull: false
    },
    options: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true
    },
    correctAnswer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    create_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
}, {
    tableName: 'questions',
    timestamps: true
})

export default Question;