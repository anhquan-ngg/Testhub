import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Choice = sequelize.define('Choice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Question',
            key: 'id'
        }
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, 
 {
    tableName: 'choices',
    timestamps: false
});

export default Choice;