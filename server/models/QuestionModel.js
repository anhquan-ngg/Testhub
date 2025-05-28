import { DataTypes, DATE } from 'sequelize';
import sequelize from '../db.js';

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    content: {
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