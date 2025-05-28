import  { DataTypes } from 'sequelize'
import sequelize from '../db'

const Submission = sequelize.define('Submission', {
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
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Question',
            key: 'id'
        }
    },
    selected_choice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Choice',
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
}, {
    tableName: 'submissions',
    timestamps: true
});

export default Submission;